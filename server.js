const express = require("express");
const app = express();
const { resolve } = require("path");
require("dotenv").config();
// Replace if using a different env file or config
const cors = require("cors");

const stripe = require("stripe")(process.env.STRIPE_KEY);
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from Node.js server!");
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.PUBLISH_KEY,
  });
});

app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "usd",
      amount: amount * 100,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.listen(5252, () => console.log(`Node server listening at port 5252`));
