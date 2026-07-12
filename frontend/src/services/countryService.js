import api from "./api";

export const getCountries = () => {
  return api.get("/numbers/countries/");
};

export const getCountry = (id) => {
  return api.get(`/numbers/countries/${id}/`);
};

export const createCountry = (data) => {
  return api.post("/numbers/countries/", data);
};

export const updateCountry = (id, data) => {
  return api.put(`/numbers/countries/${id}/`, data);
};

export const deleteCountry = (id) => {
  return api.delete(`/numbers/countries/${id}/`);
};

// Import Country Master CSV / Excel
export const importCountries = (file) => {

  const formData = new FormData();

  formData.append("file", file);

  return api.post(
    "/numbers/countries/import/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

};