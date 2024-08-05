import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (amount, currency) => {
  return await stripe.paymentIntents.create({
    amount,
    currency,
  });
};