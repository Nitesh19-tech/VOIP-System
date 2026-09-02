import API from "./api";

// =====================================================
// Termination APIs
// =====================================================

export const getTerminations = (params = {}) => {
  return API.get("carriers/terminations/", { params });
};

export const getTermination = (id) => {
  return API.get(`carriers/terminations/${id}/`);
};

export const createTermination = (data) => {
  return API.post("carriers/terminations/", data);
};

export const updateTermination = (id, data) => {
  return API.put(`carriers/terminations/${id}/`, data);
};

export const deleteTermination = (id) => {
  return API.delete(`carriers/terminations/${id}/`);
};

// =====================================================
// Import Terminations CSV
// =====================================================

export const importTerminations = (file) => {
  const formData = new FormData();

  formData.append("file", file);

  return API.post(
    "carriers/terminations/import/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};