import API from "./api";

// List SIP Accounts
export const getSipUsers = () => API.get("sip/");

// Create SIP Account
export const createSipUser = (data) => API.post("sip/", data);

// Update SIP Account
export const updateSipUser = (id, data) =>
  API.put(`sip/${id}/`, data);

// Delete SIP Account
export const deleteSipUser = (id) =>
  API.delete(`sip/${id}/`);