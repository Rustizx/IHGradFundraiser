require('dotenv').config();
const path = require('path');
const express = require("express");
const io = require('@pm2/io');

const stripe = require('stripe')(process.env.API_SECRET_TEST);

const PORT = process.env.PORT;
const app = express();

const YOUR_DOMAIN = 'https://ihgrad.com/';

app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.post("/api", (req, res) => {
  console.log(req.body.post);
  res.json({ message: "Hello Josh, from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.post('/create-checkout-session', async (req, res) => {
  let amount = parseInt(String(req.body.amount) + "00")
  if ( amount > 500 ) {
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
      success_url: `${YOUR_DOMAIN}?success=true`,
      cancel_url: `${YOUR_DOMAIN}`,
    });
    res.json({ id: session.id });
  } else {
    res.json({ error: "amount error"});
  }
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});