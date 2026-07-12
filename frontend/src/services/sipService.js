import API from "./api";

const sipService = {

  // ==========================
  // SIP Accounts
  // ==========================

  getSIPs(params = {}) {
    return API.get("sip/", {
      params,
    });
  },

  getSIP(id) {
    return API.get(`sip/${id}/`);
  },

  createSIP(data) {
    return API.post("sip/", data);
  },

  updateSIP(id, data) {
    return API.put(`sip/${id}/`, data);
  },

  deleteSIP(id) {
    return API.delete(`sip/${id}/`);
  },

  // ==========================
  // Number Pool
  // ==========================

  getAvailableNumbers() {

    return API.get("numbers/", {
      params: {
        status: "AVAILABLE",
      },
    });

  },

  // ==========================
  // Clients
  // ==========================

  getClients() {
    return API.get("clients/");
  },

  // ==========================
  // Company Admins
  // ==========================

  getAdmins() {
    return API.get("auth/users/");
  },

};

export default sipService;