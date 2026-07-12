import API from "./api";

export const updateCompanySettings = (payload) =>
  API.put("auth/settings/company/", payload);

export const logoutAllSessions = () =>
  API.post("auth/logout-all/");

// ✅ FIX: Match Django 'path("balance-status/", ...)'
export const getBalanceStatus = () =>
  API.get("auth/balance-status/");

export const changePassword = (data) =>
  API.post("auth/change-password/", data);

export const getAdminCompanies = () =>
  API.get("auth/admin/companies/");


