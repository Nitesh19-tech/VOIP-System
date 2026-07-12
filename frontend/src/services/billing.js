import API from "./api";


export const downloadInvoice = (month, year) =>
  API.get(`/billing/invoice/download/?month=${month}&year=${year}`, {
    responseType: "blob",
  });


export const getInvoices = () =>
  API.get("/billing/invoices/");


export const markInvoicePaid = (id) =>
  API.post(`/billing/invoices/${id}/mark-paid/`);


export const getRevenueSummary = () =>
  API.get("/billing/revenue-summary/");


export const adjustCredit = (companyId, data) =>
  API.post(`/billing/companies/${companyId}/adjust-credit/`, data);


export const getBillingHistory = (companyId) =>
  API.get(`/billing/companies/${companyId}/history/`);


export const generateInvoice = (companyId, month, year) =>
  API.post(`/billing/admin/generate-invoice/${companyId}/`, {
    month,
    year
  });