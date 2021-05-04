// Import Dependencies
require('dotenv').config();
const path = require('path');
const express = require("express");
const bodyParser = require('body-parser')
//const io = require('@pm2/io');
const stripe = require('stripe')(process.env.API_SECRET_TEST);

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

const getCurrentAmountAPI = (req, res) => {
  console.log("GetCurrentAmountAPI")
  pool.query('SELECT SUM (amount) AS total FROM success', (error, results) => {
      if (!error) {
        res.status(200).json(results.rows[0]);
      } else {
        response.status(400).json(error)
      }
  })
}

const addDonation = async (req, res) => {
  console.log("AddDonation")
  try {
    try {
      const name = filter.clean(req.body.name);
      const amount = req.body.amount;
      const message = filter.clean(req.body.message);
      const checkout_session_id = req.body.checkout_session_id;
      const session = await stripe.checkout.sessions.retrieve(checkout_session_id);
      pool.query("SELECT checkout_session_id from donations;", (error, results) => {
        const sessions = results.rows;
        const result = sessions.some(e => isEqual(e, {
          'checkout_session_id': req.body.token
        }));
        if(!result){
          pool.query('INSERT INTO donations (name, amount, message, checkout_session_id) VALUES ($1, $2, $3, $4)', [name, amount, message, checkout_session_id], (error, results) => {
            if (!error) {
              res.status(201).json({ success: `Donation added` })
            } else {
              res.status(400).json(error)
            }
          })
        } else {
          res.status(400).json({ error: "already_used" })
        }

      })
    } catch (err){
      res.status(400).json({ error: "bad_token" })
    }
  } catch (e) {
    res.status(401).json({ error: "bad_message"})
    console.log(e)
  }
}

const getDonations = (req, res) => {
  console.log("GetDonations")
  pool.query("SELECT name, amount, message from donations;", (error, results) => {
      if(!error) {
        res.status(200).json(results.rows)
      } else {
        response.status(400).json(error)
        console.log(error);
      }
  })
}


// Handle REST requests
app.get("/donations", getDonations);

app.post("/donation-add", addDonation);

app.get("/amount", getCurrentAmountAPI)

app.post('/checkout-info', async (req, res) => {
  console.log("CheckoutInfo")
  try {
    const session = await stripe.checkout.sessions.retrieve(req.body.token);
    pool.query("SELECT checkout_session_id from donations;", (error, results) => {
      const sessions = results.rows;
      const result = sessions.some(e => isEqual(e, {
        'checkout_session_id': req.body.token
      }));
      if(!result){
        res.status(200).json({ name: "", amount: (session.amount_total / 100)})
        try {
          pool.query("INSERT INTO success (amount, checkout_session_id) VALUES ($1, $2)", [session.amount_total / 100, req.body.token], (error, results) => {})
        } catch (e) {console.log(e)}
      } else {
        console.log(error)
        res.status(400).json({ error: "already_used" })
      }

    })
  } catch (err){
    res.status(400).json({ error: "bad_token" })
  }
});

app.post('/create-checkout-session', async (req, res) => {
  console.log("CreateCheckOut")
  let amount = parseInt(String(req.body.amount) + "00")
  stripe.balance.retrieve(async (err, balance) => {
    if ( amount > 500 && amount < (550000-((balance.pending[0].amount)*1.029)) && !err ) {
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
      res.status(400).json({ error: "amount", amount: Math.floor((550000-((balance.pending[0].amount)*1.029)) / 100)});
    }
  });
});


// Handle React Site
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});


// Report to console
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});