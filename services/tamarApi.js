import axios from 'axios';

const tamarApi = axios.create({
  baseURL: process.env.TAMAR_API_URL,
  auth: {
    username: process.env.TAMAR_API_LOGIN,
    password: process.env.TAMAR_API_TOKEN,
  },
});

export const listAvailableNumbers = async (partialNumber) => {
  const response = await tamarApi.get(`/list/available/${partialNumber}`);
  return response.data;
};

export const purchaseNumber = async (tariff, number, destination) => {
  const response = await tamarApi.post('/purchase/number/', {
    tariff,
    number,
    destination,
  });
  return response.data;
};