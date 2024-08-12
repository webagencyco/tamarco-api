import axios from 'axios';

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
  try{
    const response = await tamarApi.get(`/list/prices/tariff/`);
  res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const purchaseNumber = async (tariff, number, destination) => {
  const response = await tamarApi.post('/purchase/number/', {
    tariff,
    number,
    destination,
  });
  return response.data;
};