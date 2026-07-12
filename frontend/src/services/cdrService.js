import api from "./api";

export const getCDR = (params = {}) => {
  return api.get("/cdr/", {
    params,
  });
};

export const exportCDR = (params = {}) => {
  return api.get("/cdr/export/", {
    params,
    responseType: "blob",
  });
};