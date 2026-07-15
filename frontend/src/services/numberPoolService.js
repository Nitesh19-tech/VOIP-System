import API from "./api";

const numberPoolService = {

  getNumbers(params = {}) {
    return API.get("numbers/", {
      params,
    });
  },

  getNumber(id) {
    return API.get(`numbers/${id}/`);
  },

  createNumber(data) {
    return API.post("numbers/", data);
  },

  updateNumber(id, data) {
    return API.put(`numbers/${id}/`, data);
  },

  deleteNumber(id) {
    return API.delete(`numbers/${id}/`);
  },

  importNumbers(file) {

    const formData = new FormData();

    formData.append("file", file);

    return API.post(
      "numbers/import/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

  },

  getStatistics() {
    return API.get("numbers/statistics/");
  },

  bulkAllocate(data) {
    return API.post(
      "numbers/bulk-allocation/",
      data
    );
  },

};

export default numberPoolService;