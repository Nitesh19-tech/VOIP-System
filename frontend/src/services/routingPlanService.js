import API from "./api";

// ======================================
// Routing Plans
// ======================================

export const getRoutingPlans = (params) =>
  API.get("routing-plans/", {
    params,
  });

export const getRoutingPlan = (id) =>
  API.get(`routing-plans/${id}/`);

export const createRoutingPlan = (data) =>
  API.post("routing-plans/", data);

export const updateRoutingPlan = (id, data) =>
  API.put(`routing-plans/${id}/`, data);

export const deleteRoutingPlan = (id) =>
  API.delete(`routing-plans/${id}/`);