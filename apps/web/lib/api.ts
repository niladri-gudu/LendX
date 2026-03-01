import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API,
  timeout: 10000,
});

export const fetchPosition = async (wallet: string) => {
  const { data } = await api.get(`/positions/${wallet}`);
  return data;
};

export const fetchLiquidation = async (wallet: string) => {
  const { data } = await api.get(`/liquidation/preview/${wallet}`);
  return data;
};

export const fetchStats = async () => {
  const { data } = await api.get(`/stats/overview`);
  return data;
};

export const fetchTransactions = async (
  wallet: string,
  limit = 5,
  offset = 0,
) => {
  const { data } = await api.get(
    `/transactions/${wallet}?limit=${limit}&offset=${offset}`,
  );
  return data;
};
