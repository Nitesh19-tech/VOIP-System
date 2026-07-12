import API from "./api";

export const getCallLogs = (params = {}) =>
  API.get("stats/calls/", { params });

export const getActiveCalls = () =>
  API.get("stats/active-calls/");
