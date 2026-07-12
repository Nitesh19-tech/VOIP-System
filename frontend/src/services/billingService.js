import API from "./api";

const billingService = {

  // ==========================
  // Wallets
  // ==========================

  getWallets() {
    return API.get("billing/wallets/");
  },

  getWallet(id) {
    return API.get(`billing/wallets/${id}/`);
  },

  // ==========================
  // Recharge
  // ==========================

  recharge(data) {
    return API.post(
      "billing/wallets/recharge/",
      data
    );
  },

  // ==========================
  // Debit
  // ==========================

  debit(data) {
    return API.post(
      "billing/wallets/debit/",
      data
    );
  },

  // ==========================
  // Refund
  // ==========================

  refund(data) {
    return API.post(
      "billing/wallets/refund/",
      data
    );
  },

  // ==========================
  // Adjustment
  // ==========================

  adjust(data) {
    return API.post(
      "billing/wallets/adjust/",
      data
    );
  },

  // ==========================
  // Transactions
  // ==========================

  getTransactions(walletId) {
    return API.get(
      `billing/wallets/${walletId}/transactions/`
    );
  },

};

export default billingService;