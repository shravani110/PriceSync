import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const TOKEN_KEY = "pricesync_token";

// Live scraping can take a while: up to 3 retry attempts across 3 stores,
// each with its own ~25s page-navigation timeout.
const client = axios.create({ baseURL: API_BASE_URL, timeout: 90000 });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export async function searchProducts(query) {
  const { data } = await client.get("/api/search", { params: { q: query } });
  return data.results ?? data;
}

export async function getPriceHistory(productId) {
  const { data } = await client.get(`/api/price-history/${productId}`);
  return data.history ?? [];
}

function unwrapError(err) {
  const message = err.response?.data?.error || err.message || "Something went wrong";
  throw new Error(message);
}

export async function registerUser(name, email, password) {
  try {
    const { data } = await client.post("/api/auth/register", { name, email, password });
    return data;
  } catch (err) {
    unwrapError(err);
  }
}

export async function loginUser(email, password) {
  try {
    const { data } = await client.post("/api/auth/login", { email, password });
    return data;
  } catch (err) {
    unwrapError(err);
  }
}

export async function getMe() {
  const { data } = await client.get("/api/auth/me");
  return data.user;
}

export async function getAlerts() {
  const { data } = await client.get("/api/alerts");
  return data.alerts ?? [];
}

export async function setProductAlert(payload) {
  try {
    const { data } = await client.post("/api/alerts", payload);
    return data.alert;
  } catch (err) {
    unwrapError(err);
  }
}

export async function clearProductAlert(productId) {
  await client.delete(`/api/alerts/${productId}`);
}

export async function verifyEmail(token) {
  try {
    const { data } = await client.get(`/api/auth/verify-email/${token}`);
    return data.user;
  } catch (err) {
    unwrapError(err);
  }
}

export async function resendVerification() {
  try {
    const { data } = await client.post("/api/auth/resend-verification");
    return data;
  } catch (err) {
    unwrapError(err);
  }
}
