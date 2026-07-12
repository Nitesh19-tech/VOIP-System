import API from "./api";

const clientService = {
  // Get All Clients
  getClients() {
    return API.get("clients/");
  },

  // Get Single Client
  getClient(id) {
    return API.get(`clients/${id}/`);
  },

  // Create Client
  createClient(data) {
    return API.post("clients/", data);
  },

  // Update Client
  updateClient(id, data) {
    return API.put(`clients/${id}/`, data);
  },

  // Delete Client
  deleteClient(id) {
    return API.delete(`clients/${id}/`);
  },
};

export default clientService;