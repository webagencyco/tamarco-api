import Stripe from 'stripe';
import Number from '../models/Number.js';
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = async (req, res) => {
  const { amount, currency, source, tariff, number, destination } = req.body;
  try {
    const charge = await stripe.charges.create({
      amount,
      currency,
      source,
    });

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
