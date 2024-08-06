import Stripe from 'stripe';


export const createPaymentIntent = async (amount, currency) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  return await stripe.paymentIntents.create({
    amount,
    currency,
  });
};