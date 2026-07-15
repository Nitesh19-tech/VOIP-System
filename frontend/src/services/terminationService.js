import API from "./api";

// =====================================================
// Termination APIs
// =====================================================

export const getTerminations = (params = {}) => {
  return API.get("carriers/terminations/", { params });
};

export const getTermination = (id) => {
  return API.get(`carriers/terminations/${id}/`);
};

export const createTermination = (data) => {
  return API.post("carriers/terminations/", data);
};

export const updateTermination = (id, data) => {
  return API.put(`carriers/terminations/${id}/`, data);
};

export const deleteTermination = (id) => {
  return API.delete(`carriers/terminations/${id}/`);
};