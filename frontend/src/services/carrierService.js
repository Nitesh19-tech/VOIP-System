import API from "./api";

// =====================================================
// Carrier APIs
// =====================================================

export const getCarriers = (params = {}) => {
  return API.get("carriers/", { params });
};

export const getCarrier = (id) => {
  return API.get(`carriers/${id}/`);
};

export const createCarrier = (data) => {
  return API.post("carriers/", data);
};

export const updateCarrier = (id, data) => {
  return API.put(`carriers/${id}/`, data);
};

export const deleteCarrier = (id) => {
  return API.delete(`carriers/${id}/`);
};

// =====================================================
// Carrier IP APIs
// =====================================================

export const getCarrierIPs = (params = {}) => {
  return API.get("carriers/ips/", { params });
};

export const getCarrierIP = (id) => {
  return API.get(`carriers/ips/${id}/`);
};

export const createCarrierIP = (data) => {
  return API.post("carriers/ips/", data);
};

export const updateCarrierIP = (id, data) => {
  return API.put(`carriers/ips/${id}/`, data);
};

export const deleteCarrierIP = (id) => {
  return API.delete(`carriers/ips/${id}/`);
};