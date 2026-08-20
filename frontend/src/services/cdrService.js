import api from "./api";


// =========================================================
// GET CDR
// =========================================================

export const getCDR = (params = {}) => {

  return api.get(
    "/cdr/",
    {
      params: {
        ...params,

        // Supported:
        // 25
        // 50
        // 100
        // 500
        // all
        page_size:
          params.page_size ?? 25,
      },
    }
  );

};


// =========================================================
// EXPORT CDR
// =========================================================

export const exportCDR = (params = {}) => {

  return api.get(
    "/cdr/export/",
    {
      params: {
        ...params,
      },

      responseType: "blob",
    }
  );

};