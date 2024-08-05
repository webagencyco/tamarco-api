import Stripe from 'stripe';
import axios from 'axios';
import Number from '../models/Number.js';


export const processPayment = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { amount, currency, source, tariff, number, destination } = req.body;
  // console.log('Request Body:', req.body); // Log the request body to verify

  try {
    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
    });
    // console.log('Charge:', charge); // Log the charge to verify

    const response = await axios.post(
      `${process.env.TAMAR_API_URL}/purchase/number`,
      {
        tariff,
        number,
        destination,
      },
      {
        auth: {
          username: process.env.TAMAR_API_LOGIN,
          password: process.env.TAMAR_API_TOKEN,
        },
      }
    );
    console.log('Tamar API Response:', response.data); // Log the Tamar API response to verify

    const newNumber = new Number({
      userId: req.user.id,
      number: response.data.number,
      tariff,
      destination,
    });
    await newNumber.save();

    res.json({ charge, number: newNumber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
