// Import Dependencies
require('dotenv').config();
const path = require('path');
const express = require("express");
const bodyParser = require('body-parser')
const io = require('@pm2/io');
const stripe = require('stripe')(process.env.API_SECRET);

const Pool = require('pg').Pool;
const Filter = require('bad-words');

// Set Consts
const PORT = process.env.PORT;
const app = express();

const YOUR_DOMAIN = process.env.DOMAIN;

const filter = new Filter({ placeholder: "x" });


// Setup Express
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Setup pm2
const badToken = io.counter({
  name: 'Total Bad Tokens Attempted',
  id: 'app/request/token/bad'
});

const reusedToken = io.counter({
  name: 'Total Attempted Reused Tokens',
  id: 'app/request/token/reuse'
});

const getCurrentAmountMETER = io.meter({
  name: 'GetCurrentAmount',
  id: 'app/requests/GetCurrentAmount'
});

const addDonationMETER = io.meter({
  name: 'AddDonation',
  id: 'app/requests/AddDonation'
});

const getDonationsMETER = io.meter({
  name: 'GetDonations',
  id: 'app/requests/GetDonations'
});

const checkoutInfoMETER = io.meter({
  name: 'CheckoutInfo',
  id: 'app/requests/CheckoutInfo'
});

const createCheckoutSessionMETER = io.meter({
  name: 'CreateCheckoutSession',
  id: 'app/requests/CreateCheckoutSession'
});


// Functions

const isEqual = (first, second) => {
  return JSON.stringify(first) === JSON.stringify(second);
}


// POSTGRES 

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
});


// API functions

const getCurrentAmountAPI = (req, res) => {
  getCurrentAmountMETER.mark();
  try {
    pool.query('SELECT SUM (amount) AS total FROM success', (error, results) => {
        if (!error) {
          res.status(200).json(results.rows[0]);
        } else {
          res.status(400).json(error)
        }
    })
  } catch (error) {
    io.notifyError(new Error('GetCurrentAmount Failed'), {
      custom: {
        req: req,
      }
    });
    res.status(500).json({ error: "internal_error"});
  }
}


const addDonation = async (req, res) => {
  addDonationMETER.mark();
  try {
    try {
      let name, message;
      try {
        name = filter.clean(req.body.name);
      } catch (e) {
        name = req.body.name;
      }

      try {
        message = filter.clean(req.body.message);
      } catch (e) {
        message = req.body.message;
      }

      const amount = req.body.amount;
      const checkout_session_id = req.body.checkout_session_id;
      const session = await stripe.checkout.sessions.retrieve(checkout_session_id);
      pool.query("SELECT checkout_session_id from donations;", (error, results) => {
        const sessions = results.rows;
        const result = sessions.some(e => isEqual(e, {
          'checkout_session_id': req.body.token
        }));
        if(!result){
          pool.query('INSERT INTO donations (name, amount, message, checkout_session_id, created) VALUES ($1, $2, $3, $4, $5);', [name, amount, message, checkout_session_id, Date.now()], (error, results) => {
            if (!error) {
              pool.query('UPDATE success SET completed = true WHERE checkout_session_id = $1;', [checkout_session_id], (error, results) => {
                if(!error){
                  res.status(201).json({ success: `Donation added` });
                } else {
                  res.status(400).json(error);
                }
              })
            } else {
              res.status(400).json(error);
            }
          })
        } else {
          reusedToken.inc();
          res.status(400).json({ error: "already_used" });
        }

      })
    } catch (err){
      console.log(err)
      badToken.inc();
      res.status(400).json({ error: "bad_token" });
    }
  } catch (error) {
    io.notifyError(new Error('AddDonation Failed'), {
      custom: {
        req: req,
      }
    });
    res.status(500).json({ error: "internal_error"});
  }
}


const getDonations = (req, res) => {
  getDonationsMETER.mark();
  try {
    pool.query("SELECT name, amount, message from donations;", (error, results) => {
        if(!error) {
          res.status(200).json(results.rows);
        } else {
          res.status(400).json(error);
        }
    })
  } catch (error) {
    io.notifyError(new Error('GetDonations Failed'), {
      custom: {
        req: req,
      }
    });
    res.status(500).json({ error: "internal_error"});
  }
}


const checkoutInfo = async (req, res) => {
  checkoutInfoMETER.mark();
  try {
    try {
      const session = await stripe.checkout.sessions.retrieve(req.body.token);
      pool.query("SELECT checkout_session_id from donations;", (error, results) => {
        const sessions = results.rows;
        const result = sessions.some(e => isEqual(e, {
          'checkout_session_id': req.body.token
        }));
        if(!result){
          res.status(200).json({ name: "", amount: (session.amount_total / 100)});
          try {
            pool.query("INSERT INTO success (amount, checkout_session_id, created) VALUES ($1, $2, $3)", [session.amount_total / 100, req.body.token, parseInt(Date.now())], (error, results) => {})
          } catch (e) {}
        } else {
          reusedToken.inc();
          res.status(400).json({ error: "already_used" });
        }

      })
    } catch (err){
      badToken.inc();
      res.status(400).json({ error: "bad_token" });
    }
  } catch (error) {
    io.notifyError(new Error('CheckoutInfo Failed'), {
      custom: {
        req: req,
      }
    });
    res.status(500).json({ error: "internal_error"});
  }
}


const createCheckoutSession = async (req, res) => {
  createCheckoutSessionMETER.mark();
  try {
    let amount = parseInt(String(req.body.amount) + "00");
    stripe.balance.retrieve(async (err, balance) => {
      if ( amount > 500 && amount < (490000-((balance.pending[0].amount)*1.04)) && !err ) {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'cad',
                product_data: {
                  name: 'IHHS Graduation Donation',
                  images: ['https://i.ibb.co/NNrFMhx/graduation.png'],
                },
                unit_amount: amount,
              },
              quantity: 1,
            },
          ],
          billing_address_collection: "required",
          mode: 'payment',
          success_url: `${YOUR_DOMAIN}finalize/{CHECKOUT_SESSION_ID}`,
          cancel_url: `${YOUR_DOMAIN}`,
        });
        res.status(200).json({ id: session.id });
      } else {
        res.status(400).json({ error: "amount", amount: Math.floor((490000-((balance.pending[0].amount)*1.04)) / 100)});
      }
    });
  } catch (e) {
    io.notifyError(new Error('CreateCheckoutSession Failed'), {
      custom: {
        req: req,
      }
    });
    res.status(500).json({ error: "internal_error"});
  }
}


// Handle REST requests
app.get("/donations", getDonations);

app.get("/amount", getCurrentAmountAPI);

app.post("/donation-add", addDonation);

app.post('/checkout-info', checkoutInfo);

app.post('/create-checkout-session', createCheckoutSession);


// Handle React Site
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


// Report to console
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  console.log(`${process.env.MODE} mode`);
});