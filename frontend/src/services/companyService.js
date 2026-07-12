import API from "./api";

const companyService = {
  getCompanies() {
    return API.get("companies/");
  },

  getCompany(id) {
    return API.get(`companies/${id}/`);
  },

  createCompany(data) {
    return API.post("companies/", data);
  },

  updateCompany(id, data) {
    return API.put(`companies/${id}/`, data);
  },

  deleteCompany(id) {
    return API.delete(`companies/${id}/`);
  },
};

export default companyService;