import axios from "axios";
import {baseUrl, headers} from './api'

export const getStockTickers = async (searchTerm) => {
  const { data } = await axios.get(
    `${baseUrl}/search/?query=${searchTerm}`,
    {
      headers,
    }
  );
  return Object.entries(data).map(([key, value]) => ({ label: key, value }));
};

export const getStockPrice = async (tickers) => {
  const { data } = await axios.get(
    `${baseUrl}/prices/?tickers=${tickers.join()}`,
    {
      headers,
    }
  );
  return Object.entries(data).map(([key, value]) => ({
    ticker: key,
    ...value,
  }));
};
