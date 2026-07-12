import api from "./api";

const BASE_URL = "/trunks/";

export const getTrunks = () =>
  api.get(BASE_URL);

export const getTrunk = (id) =>
  api.get(`${BASE_URL}${id}/`);

export const createTrunk = (data) =>
  api.post(BASE_URL, data);

export const updateTrunk = (id, data) =>
  api.put(`${BASE_URL}${id}/`, data);

export const deleteTrunk = (id) =>
  api.delete(`${BASE_URL}${id}/`);