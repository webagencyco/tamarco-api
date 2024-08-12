import Stripe from 'stripe';
import Payment from '../models/Payment.js';
import Number from '../models/Number.js';
import Invoice from '../models/Invoice.js';

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id }).populate('paymentId');
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const processPayment = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { amount, currency, tariff, number, destination, includedMinutes } = req.body;
  console.log('Request Body:', req.body);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      metadata: { tariff, number, destination },
    });

    const newPayment = new Payment({
      userId: req.user.id,
      amount,
      currency,
      paymentIntentId: paymentIntent.id,
      tariff,
      number,
      destination,
      status: 'pending',
    });
    await newPayment.save();

    let existingNumber = await Number.findOne({ userId: req.user.id, number });
    
    if (existingNumber) {
      existingNumber.usage.push({ date: new Date(), usageMinutes: includedMinutes });
      existingNumber.calculateUsage();
      await existingNumber.save();
    } else {
      const newNumber = new Number({
        userId: req.user.id,
        number: number,
        tariff,
        destination,
        includedMinutes: includedMinutes || 0,
        usage: [{ date: new Date(), usageMinutes: includedMinutes }],
      });
      newNumber.calculateUsage();
      await newNumber.save();
    }
    const newNumber = new Number({
      userId: req.user.id,
      number: number,
      tariff,
      destination,
      includedMinutes: includedMinutes || 0,
    });

    await newNumber.save();

    const newInvoice = new Invoice({
      userId: req.user.id,
      paymentId: newPayment._id,
      number,
      tariff,
      destination,
      amount,
      currency,
    });
    await newInvoice.save();

    res.json({ number: newNumber, clientSecret: paymentIntent.client_secret });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

