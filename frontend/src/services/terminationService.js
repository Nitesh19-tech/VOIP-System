import API from "./api";

// =====================================================
// Termination APIs
// =====================================================

export const getTerminations = (params = {}) => {
  return API.get("terminations/", { params });
};

export const getTermination = (id) => {
  return API.get(`terminations/${id}/`);
};

export const createTermination = (data) => {
  return API.post("terminations/", data);
};

export const updateTermination = (id, data) => {
  return API.put(`terminations/${id}/`, data);
};

export const deleteTermination = (id) => {
  return API.delete(`terminations/${id}/`);
};