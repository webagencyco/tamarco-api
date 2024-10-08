import { listNumbers, purchaseNumber, listTariffs } from "../services/tamarApi.js";
import { createPaymentIntent } from "../services/stripe.js";
import Number from "../models/Number.js";

export const createNumber = async (req, res) => {
  try {
    const { number, tariff, destination, includedMinutes } = req.body;
    const newNumber = new Number({
      number,
      tariff,
      destination,
      userId: req.user.id,
      includedMinutes,
    });
    await newNumber.save();
    res.json(newNumber);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNumbers = async (req, res) => {
  try {
    const numbers = await Number.find({ userId: req.user.id }).select(
      "number _id createdAt includedMinutes"
    );
    res.json(numbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTariffs = async (req, res) => {
  try {
    const tariffs = await listTariffs();
    res.json(tariffs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getApiNumber = async (req, res) => {
  try {
    const numbers = await listNumbers();
    res.json(numbers);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
}

export const initiateNumberPurchase = async (req, res) => {
  try {
    const { tariff, number, destination } = req.body;
    const amount = 1000;
    const paymentIntent = await createPaymentIntent(amount, "usd");
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completeNumberPurchase = async (req, res) => {
  try {
    const { tariff, number, destination, paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment was not successful");
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
      return res.status(404).json({ message: "Number not found" });
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
      return res.status(404).json({ message: "Number not found" });
    }
    await Number.deleteOne({ _id: numberId });
    res.json({ message: "Number cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addNumberUsage = async (req, res) => {
  const { numberId, date, usageMinutes } = req.body;
  try {
    const number = await Number.findById(numberId);
    if (!number) {
      return res.status(404).json({ message: "Number not found" });
    }

    const usageEntry = { date, usageMinutes };
    const updatedUsage = [...number.usage, usageEntry];

    const minutesUsed = updatedUsage.reduce(
      (total, entry) => total + entry.usageMinutes,
      0
    );
    const totalCalls = updatedUsage.length;
    const availableMinutes =
      number.includedMinutes > minutesUsed
        ? number.includedMinutes - minutesUsed
        : 0;
    const overage =
      minutesUsed > number.includedMinutes
        ? minutesUsed - number.includedMinutes
        : 0;

    await Number.findByIdAndUpdate(numberId, {
      $push: { usage: usageEntry },
      minutesUsed,
      totalCalls,
      availableMinutes,
      overage,
    });

    res.json({ message: "Usage data added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding usage data", error: error.message });
  }
};

export const getNumberUsage = async (req, res) => {
  const { numberId } = req.params;
  try {
    const number = await Number.findById(numberId).select("usage ");
    if (!number) {
      return res.status(404).json({ message: "Number not found" });
    }
    res.json(number.usage);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching usage data", error: error.message });
  }
};
