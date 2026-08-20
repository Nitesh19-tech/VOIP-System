import api from "./api";


/* =========================================================
   GET FAILED REPORTS
========================================================= */

export const getFailedReports = (
  params = {}
) => {

  return api.get(
    "/cdr/failed/",
    {
      params,
    }
  );

};


/* =========================================================
   EXPORT CSV
========================================================= */

export const exportFailedReports = (
  params = {}
) => {

  return api.get(
    "/cdr/failed/export/",
    {
      params,
      responseType: "blob",
    }
  );

};