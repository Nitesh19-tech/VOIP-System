import API from "./api";

// =====================================================
// Incoming Route APIs
// =====================================================

export const getIncomingRoutes = (params = {}) => {
  return API.get("inbound/routes/", {
    params,
  });
};

export const getIncomingRoute = (id) => {
  return API.get(`inbound/routes/${id}/`);
};

export const createIncomingRoute = (data) => {
  return API.post("inbound/routes/", data);
};

export const updateIncomingRoute = (id, data) => {
  return API.put(
    `inbound/routes/${id}/`,
    data
  );
};

export const deleteIncomingRoute = (id) => {
  return API.delete(
    `inbound/routes/${id}/`
  );
};

// =====================================================
// Apply Incoming Changes
// =====================================================

export const applyIncomingChanges = () => {
  return API.post(
    "inbound/routes/apply/"
  );
};