import API from "./api";

const rateService = {

  // List
  getRates(params = {}) {
    return API.get(
      "billing/rates/",
      {
        params,
      }
    );
  },

  // Single
  getRate(id) {
    return API.get(
      `billing/rates/${id}/`
    );
  },

  // Create
  createRate(data) {
    return API.post(
      "billing/rates/",
      data,
    );
  },

  // Update
  updateRate(id, data) {
    return API.put(
      `billing/rates/${id}/`,
      data,
    );
  },

  // Delete
  deleteRate(id) {
    return API.delete(
      `billing/rates/${id}/`
    );
  },

};

export default rateService;