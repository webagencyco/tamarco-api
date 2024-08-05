import { listAvailableNumbers, purchaseNumber } from '../services/tamarApi.js';
import { createPaymentIntent } from '../services/stripe.js';
import Number from '../models/Number.js';

export const getNumbers = async (req, res) => {
  try {
    const numbers = await Number.find({ userId: req.user.id });
    res.json(numbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const searchNumbers = async (req, res) => {
  try {
    const numbers = await listAvailableNumbers(req.query.partialNumber);
    res.json(numbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const initiateNumberPurchase = async (req, res) => {
  try {
    const { tariff, number, destination } = req.body;
    const amount = 1000; // Example: $10.00
    const paymentIntent = await createPaymentIntent(amount, 'usd');
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completeNumberPurchase = async (req, res) => {
  try {
    const { tariff, number, destination, paymentIntentId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      throw new Error('Payment was not successful');
    }

    const purchaseResult = await purchaseNumber(tariff, number, destination);

    const newNumber = new Number({
      userId: req.user.id,
      number: purchaseResult.number,
      tariff,
      destination,
    });
    await newNumber.save();

    res.json({ success: true, number: newNumber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNumberDestination = async (req, res) => {
  try {
    const { numberId, newDestination } = req.body;
    const number = await Number.findOne({ _id: numberId, userId: req.user.id });
    if (!number) {
      return res.status(404).json({ message: 'Number not found' });
    }
    number.destination = newDestination;
    await number.save();
    res.json(number);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelNumber = async (req, res) => {
  try {
    const { numberId } = req.params;
    const number = await Number.findOne({ _id: numberId, userId: req.user.id });
    if (!number) {
      return res.status(404).json({ message: 'Number not found' });
    }
    await Number.deleteOne({ _id: numberId });
    res.json({ message: 'Number cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};