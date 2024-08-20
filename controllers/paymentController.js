import Stripe from "stripe";
import Payment from "../models/Payment.js";
import Number from "../models/Number.js";
import Invoice from "../models/Invoice.js";
import { purchaseCallWhisper, purchaseNumber } from "../services/tamarApi.js";

export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id }).populate(
      "paymentId"
    );
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const processPayment = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let { amount, currency, numbers, subtotal, vat } = req.body;

  try {
    amount = Math.round(amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency,
      metadata: { subtotal, vat },
    });
    console.log("Payment Intent created:", paymentIntent.id);

    console.log("Request Body:", req.body);
    let result = {};
    const newPayment = new Payment({
      userId: req.user.id,
      amount,
      currency,
      paymentIntentId: paymentIntent.id,
      status: "pending",
    });

    await newPayment.save();
    console.log("Payment saved:", newPayment._id);

    for (const numberDetails of numbers) {
      const { number, tariff, destination, tailorPrice, price, tariffPrice } = numberDetails;
      console.log(numberDetails)
      const parsedPrice = parseFloat(price);
      const parsedTailorPrice = parseFloat(tailorPrice);

      try {
        let numberResult = await purchaseNumber(tariffPrice, number, destination);
        console.log("Purchase result:", result);

        result = {
          ...result,
          ...numberResult,
        }
        // if (tailorPrice > 5) {

        // } else if (tailorPrice < 5 && tailorPrice > 0) {
        //   whisperResult = await purchaseCallWhisper(number);
        //   console.log("Whisper result:", whisperResult);
        // }

        const newNumber = new Number({
          userId: req.user.id,
          number,
          tariff,
          price: parsedPrice,
          tariffPrice,
          tailorPrice: parsedTailorPrice,
          destination,
        });

        await newNumber.save();

        const newInvoice = new Invoice({
          userId: req.user.id,
          paymentId: newPayment._id,
          number,
          tariff: tariffPrice,
          destination,
          amount,
          currency,
        });

        await newInvoice.save();
      } catch (error) {
        console.error("Error processing number:", error.message);
      }
    }
    res.json({ clientSecret: paymentIntent.client_secret, result });
  } catch (error) {
    res.status(500).json({ error });
  }
};
