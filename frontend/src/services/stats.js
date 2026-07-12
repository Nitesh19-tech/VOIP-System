import API from "./api";

export const getDashboardOverview = () =>
  API.get("dashboard/overview/");

export const getDashboardExtensions = () =>
  API.get("dashboard/extensions/");

export const getDashboardDevices = () =>
  API.get("dashboard/devices/");

export const getDashboardActiveCalls = () =>
  API.get("dashboard/active-calls/");