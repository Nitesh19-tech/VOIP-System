import API from "./api";

const assignService = {

  assignNumbers(data) {
    return API.post(
      "numbers/assign/",
      data
    );
  },

};

export default assignService;