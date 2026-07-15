import API from "./api";

export const getRoutes = () =>
  API.get("/routes/");

export const getRoute = (id) =>
  API.get(`/routes/${id}/`);

export const createRoute = (data) =>
  API.post("/routes/", data);

export const updateRoute = (id, data) =>
  API.put(`/routes/${id}/`, data);

export const deleteRoute = (id) =>
  API.delete(`/routes/${id}/`);