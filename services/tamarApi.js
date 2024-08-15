import axios from "axios";

const tamarApi = axios.create({
  baseURL: process.env.TAMAR_API_URL,
  auth: {
    username: process.env.TAMAR_API_LOGIN,
    password: process.env.TAMAR_API_TOKEN,
  },
});

export const listNumbers = async () => {
  const response = await tamarApi.get(`/list/numbers`);
  return response.data;
};

export const listTariffs = async () => {
  const response = await tamarApi.get(`/list/tariffs/`);
  return response.data;
};

export const tariffPrices = async (req, res) => {
  try {
    const response = await tamarApi.get(`/list/prices/tariff/`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const purchaseNumber = async (tariff, number, destination) => {
  try {
    const response = await tamarApi.post("/purchase/number/", {
      tariff,
      number,
      destination,
    });
    return response.data;
  } catch (error) {
    console.error("Error purchasing number:", error.message);
    throw new Error("Failed to purchase number");
  }
};

export const getWhisperPrices = async (req, res) => {
  try {
    const response = await tamarApi.get("/list/prices/whisper/");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVsbPrices = async (req, res) => {
  try {
    const response = await tamarApi.get("/list/prices/vsb/");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPartialNumbers = async (req, res) => {
  try {
    const partialNumber = req.params.partialnumber;
    let combinedResults = {};

    const fetchNumbers = async (partial) => {
      const response = await tamarApi.get(`/list/available/${partial}`);
      return response.data;
    };

    combinedResults = await fetchNumbers(partialNumber);

    if (partialNumber === "01") {
      const results02 = await fetchNumbers("02");
      combinedResults = { ...combinedResults, ...results02 };
    }

    res.json(combinedResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const purchaseCallWhisper = async (req, res, number) => {
  try {
    const response = await tamarApi.post("/purchase/callwhisper/", { number });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const purchaseSwitchboard = async (req, res) => {
  try {
    const response = await tamarApi.get("/purchase/switchboard/");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
