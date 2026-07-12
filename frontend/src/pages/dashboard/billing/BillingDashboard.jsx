import { useEffect, useState } from "react";
import {
  Wallet,
  RefreshCw,
  Search,
  Plus,
  Minus,
} from "lucide-react";

import billingService from "../../../services/billingService";

import WalletTable from "./wallet/WalletTable";
import RechargeModal from "./wallet/RechargeModal";
import DebitModal from "./wallet/DebitModal";
import TransactionModal from "./transaction/TransactionModal";

export default function BillingDashboard({ user }) {

  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedWallet, setSelectedWallet] = useState(null);

  const [showRecharge, setShowRecharge] = useState(false);
  const [showDebit, setShowDebit] = useState(false);
  const [showTransactions, setShowTransactions] =
    useState(false);

  const [processing, setProcessing] =
    useState(false);

  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({

    total_wallets: 0,

    total_balance: 0,

    active_wallets: 0,

    inactive_wallets: 0,

  });
    const loadWallets = async () => {

    try {

      setLoading(true);

      const res =
        await billingService.getWallets();

      const data = res.data.data || [];

      setWallets(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  };

  const loadStatistics = async () => {

    try {

      const res =
        await billingService.getWallets();

      const data = res.data.data || [];

      setStats({

        total_wallets: data.length,

        total_balance: data.reduce(
          (sum, wallet) =>
            sum + Number(wallet.balance),
          0
        ),

        active_wallets: data.filter(
          (wallet) => wallet.is_active
        ).length,

        inactive_wallets: data.filter(
          (wallet) => !wallet.is_active
        ).length,

      });

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    loadWallets();

    loadStatistics();

  }, []);

  const filteredWallets = wallets.filter((wallet) =>

    `${wallet.client_name || ""}
     ${wallet.admin_name || ""}
     ${wallet.balance}`
      .toLowerCase()
      .includes(search.toLowerCase())

  );

  const openRecharge = (wallet) => {

    setSelectedWallet(wallet);

    setShowRecharge(true);

  };

  const openDebit = (wallet) => {

    setSelectedWallet(wallet);

    setShowDebit(true);

  };

  const openTransactions = (wallet) => {

    setSelectedWallet(wallet);

    setShowTransactions(true);

  };
    const handleRecharge = async (form) => {

    try {

      setProcessing(true);

      await billingService.recharge({

        wallet: selectedWallet.id,

        amount: form.amount,

        reference: form.reference,

        description: form.description,

      });

      setShowRecharge(false);

      setSelectedWallet(null);

      await loadWallets();

      await loadStatistics();

    } catch (err) {

      console.error(err);

      alert(

        err.response?.data?.message ||

        "Unable to recharge wallet."

      );

    } finally {

      setProcessing(false);

    }

  };

  const handleDebit = async (form) => {

    try {

      setProcessing(true);

      await billingService.debit({

        wallet: selectedWallet.id,

        amount: form.amount,

        reference: form.reference,

        description: form.description,

      });

      setShowDebit(false);

      setSelectedWallet(null);

      await loadWallets();

      await loadStatistics();

    } catch (err) {

      console.error(err);

      alert(

        err.response?.data?.message ||

        "Unable to debit wallet."

      );

    } finally {

      setProcessing(false);

    }

  };

  const refresh = async () => {

    await loadWallets();

    await loadStatistics();

  };
    return (

    <div className="p-6 space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <h1 className="text-3xl font-bold">
            Billing
          </h1>

          <p className="text-slate-500 mt-1">
            Manage Wallets & Transactions.
          </p>

        </div>

        <button
          onClick={refresh}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
        >

          <RefreshCw size={18} />

          Refresh

        </button>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">

        <div className="bg-white dark:bg-slate-900 rounded-xl border shadow p-5">

          <p className="text-sm text-slate-500">
            Total Wallets
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats.total_wallets}
          </h2>

        </div>

        <div className="bg-green-50 rounded-xl border border-green-100 shadow p-5">

          <p className="text-sm text-green-700">
            Total Balance
          </p>

          <h2 className="text-3xl font-bold mt-2 text-green-700">

            ₹ {stats.total_balance}

          </h2>

        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-100 shadow p-5">

          <p className="text-sm text-blue-700">
            Active Wallets
          </p>

          <h2 className="text-3xl font-bold mt-2 text-blue-700">

            {stats.active_wallets}

          </h2>

        </div>

        <div className="bg-red-50 rounded-xl border border-red-100 shadow p-5">

          <p className="text-sm text-red-700">
            Inactive Wallets
          </p>

          <h2 className="text-3xl font-bold mt-2 text-red-700">

            {stats.inactive_wallets}

          </h2>

        </div>

      </div>

      {/* Search */}

      <div className="relative max-w-lg">

        <Search
          size={18}
          className="absolute left-3 top-3.5 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search Client..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
        />

      </div>

      {/* Wallet Table */}

      <WalletTable

        wallets={filteredWallets}

        loading={loading}

        user={user}

        onRecharge={openRecharge}

        onDebit={openDebit}

        onTransactions={openTransactions}

      />

      {/* Recharge Modal */}

      <RechargeModal

        open={showRecharge}

        wallet={selectedWallet}

        saving={processing}

        onClose={() => {

          setShowRecharge(false);

          setSelectedWallet(null);

        }}

        onSave={handleRecharge}

      />

      {/* Debit Modal */}

      <DebitModal

        open={showDebit}

        wallet={selectedWallet}

        saving={processing}

        onClose={() => {

          setShowDebit(false);

          setSelectedWallet(null);

        }}

        onSave={handleDebit}

      />

      {/* Transaction Modal */}

      <TransactionModal

        open={showTransactions}

        wallet={selectedWallet}

        onClose={() => {

          setShowTransactions(false);

          setSelectedWallet(null);

        }}

      />

    </div>

  );

}