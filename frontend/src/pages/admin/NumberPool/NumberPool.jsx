import { useEffect, useState } from "react";

import {
  Plus,
  Search,
  Upload,
  RefreshCw,
  Globe,
  Trash2,
  Undo2,
  Truck,
} from "lucide-react";

import numberPoolService from "../../../services/numberPoolService";
import { getCountries } from "../../../services/countryService";
import { getCarriers } from "../../../services/carrierService";

import NumberTable from "./NumberTable";
import NumberFormModal from "./NumberFormModal";
import NumberDeleteModal from "./NumberDeleteModal";
import BulkAllocationModal from "./BulkAllocationModal";
import NumberImportModal from "./NumberImportModal";


export default function NumberPool({ user }) {

  // =====================================================
  // STATISTICS
  // =====================================================

  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    reserved: 0,
    disabled: 0,
  });


  // =====================================================
  // DATA
  // =====================================================

  const [numbers, setNumbers] = useState([]);

  const [countries, setCountries] = useState([]);

  const [carriers, setCarriers] = useState([]);


  // =====================================================
  // UI STATE
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [showImport, setShowImport] = useState(false);

  const [showDelete, setShowDelete] = useState(false);

  const [showAllocation, setShowAllocation] =
    useState(false);


  const [selectedNumber, setSelectedNumber] =
    useState(null);


  const [selectedNumbers, setSelectedNumbers] =
    useState([]);


  const [saving, setSaving] =
    useState(false);


  const [deleting, setDeleting] =
    useState(false);


  // =====================================================
  // PAGINATION
  // =====================================================

  const [currentPage, setCurrentPage] =
    useState(1);


  const [pageSize, setPageSize] =
    useState(25);


  const [pagination, setPagination] =
    useState({
      count: 0,
      page: 1,
      page_size: 25,
      total_pages: 1,
      next: null,
      previous: null,
    });


  // =====================================================
  // FILTERS
  // =====================================================

  const [search, setSearch] =
    useState("");

  const [country, setCountry] =
    useState("");

  const [carrier, setCarrier] =
    useState("");

  const [status, setStatus] =
    useState("");


  // =====================================================
  // LOAD STATISTICS
  // =====================================================

  const loadStatistics = async () => {

    try {

      const res =
        await numberPoolService.getStatistics();


      setStats(
        res.data?.data || {
          total: 0,
          available: 0,
          assigned: 0,
          reserved: 0,
          disabled: 0,
        }
      );

    } catch (err) {

      console.error(
        "Statistics Error:",
        err
      );

    }

  };


  // =====================================================
  // LOAD COUNTRIES
  // =====================================================

  const loadCountries = async () => {

    try {

      const res =
        await getCountries();


      setCountries(
        res.data?.data ||
        res.data?.results ||
        []
      );

    } catch (err) {

      console.error(
        "Countries Error:",
        err
      );


      setCountries([]);

    }

  };


  // =====================================================
  // LOAD CARRIERS
  // =====================================================

  const loadCarriers = async () => {

    try {

      const res =
        await getCarriers();


      const data =
        res.data?.data ||
        res.data?.results ||
        [];


      setCarriers(data);

    } catch (err) {

      console.error(
        "Carriers Error:",
        err
      );


      setCarriers([]);

    }

  };


  // =====================================================
  // LOAD NUMBERS
  // =====================================================

  const loadNumbers = async () => {

    try {

      setLoading(true);


      const params = {

        page: currentPage,

        page_size: pageSize,

      };


      // SEARCH

      if (search.trim()) {

        params.search =
          search.trim();

      }


      // COUNTRY

      if (country) {

        params.country =
          country;

      }


      // CARRIER

      if (carrier) {

        params.carrier =
          carrier;

      }


      // STATUS

      if (status) {

        params.status =
          status;

      }


      console.log(
        "Number Pool Params:",
        params
      );


      const res =
        await numberPoolService.getNumbers(
          params
        );


      console.log(
        "Number Pool Response:",
        res.data
      );


      const loadedNumbers =
        res.data?.data ||
        res.data?.results ||
        [];


      const serverPagination =
        res.data?.pagination;


      setNumbers(
        loadedNumbers
      );


      setPagination(
        serverPagination || {
          count: loadedNumbers.length,
          page: currentPage,
          page_size: pageSize,
          total_pages: 1,
          next: null,
          previous: null,
        }
      );


      // =================================================
      // CURRENT PAGE VALIDATION
      // =================================================

      const totalPages =
        serverPagination?.total_pages || 1;


      if (
        currentPage > totalPages
      ) {

        setCurrentPage(
          totalPages
        );

      }


      // =================================================
      // REMOVE OLD SELECTIONS
      // =================================================

      const currentIds =
        new Set(
          loadedNumbers.map(
            (item) => item.id
          )
        );


      setSelectedNumbers(
        (prev) =>
          prev.filter(
            (id) =>
              currentIds.has(id)
          )
      );


    } catch (err) {

      console.error(
        "Load Numbers Error:",
        err
      );


      console.error(
        "Number API Error:",
        err.response?.data
      );


      setNumbers([]);


      setPagination({
        count: 0,
        page: 1,
        page_size: pageSize,
        total_pages: 1,
        next: null,
        previous: null,
      });

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadStatistics();

    loadCountries();

    loadCarriers();

  }, []);


  // =====================================================
  // FILTER CHANGE
  // =====================================================

  useEffect(() => {

    if (currentPage !== 1) {

      setCurrentPage(1);

    }

  }, [
    search,
    country,
    carrier,
    status,
  ]);


  // =====================================================
  // LOAD NUMBERS
  // =====================================================

  useEffect(() => {

    loadNumbers();

  }, [
    currentPage,
    pageSize,
    search,
    country,
    carrier,
    status,
  ]);


  // =====================================================
  // IMPORT NUMBERS
  // =====================================================

  const openImport = () => {
    setShowImport(true);
  };

  const handleImportSuccess = async () => {
    setShowImport(false);
    setSelectedNumbers([]);
    setCurrentPage(1);

    await Promise.all([
      loadNumbers(),
      loadStatistics(),
    ]);
  };


  // =====================================================
  // CREATE
  // =====================================================

  const openCreate = () => {

    setSelectedNumber(null);

    setShowForm(true);

  };


  // =====================================================
  // EDIT
  // =====================================================

  const openEdit = (number) => {

    setSelectedNumber(number);

    setShowForm(true);

  };


  // =====================================================
  // DELETE MODAL
  // =====================================================

  const openDelete = (number) => {

    setSelectedNumber(number);

    setShowDelete(true);

  };


  // =====================================================
  // ALLOCATION MODAL
  // =====================================================

  const openAllocation = () => {

    if (
      selectedNumbers.length === 0
    ) {

      alert(
        "Please select at least one number."
      );

      return;

    }


    setShowAllocation(true);

  };


  // =====================================================
  // SAVE NUMBER
  // =====================================================

  const saveNumber = async (data) => {

    try {

      setSaving(true);


      if (selectedNumber) {

        await numberPoolService.updateNumber(
          selectedNumber.id,
          data
        );

      } else {

        await numberPoolService.createNumber(
          data
        );

      }


      setShowForm(false);

      setSelectedNumber(null);


      await loadNumbers();

      await loadStatistics();

    } catch (err) {

      console.error(
        "Save Number Error:",
        err
      );


      console.error(
        "Save Response:",
        err.response?.data
      );


      alert(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to save number."
      );

    } finally {

      setSaving(false);

    }

  };


  // =====================================================
  // BULK DELETE
  // =====================================================

  const handleBulkDelete = async () => {

    if (
      selectedNumbers.length === 0
    ) {

      alert(
        "Please select at least one number."
      );

      return;

    }


    if (
      !window.confirm(
        `Delete ${selectedNumbers.length} selected numbers?`
      )
    ) {

      return;

    }


    try {

      setDeleting(true);


      await Promise.all(

        selectedNumbers.map(
          (id) =>
            numberPoolService.deleteNumber(
              id
            )
        )

      );


      setSelectedNumbers([]);


      if (
        numbers.length === 1 &&
        currentPage > 1
      ) {

        setCurrentPage(
          (page) =>
            Math.max(
              1,
              page - 1
            )
        );

      } else {

        await loadNumbers();

      }


      await loadStatistics();


      alert(
        "Selected numbers deleted successfully."
      );


    } catch (err) {

      console.error(
        "Bulk Delete Error:",
        err
      );


      console.error(
        "Bulk Delete Response:",
        err.response?.data
      );


      alert(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to delete selected numbers."
      );

    } finally {

      setDeleting(false);

    }

  };


  // =====================================================
  // BULK UNALLOCATION
  // =====================================================

  const handleBulkUnallocate = async () => {

    if (
      selectedNumbers.length === 0
    ) {

      alert(
        "Please select at least one assigned number."
      );

      return;

    }


    if (
      !window.confirm(
        `Unallocate ${selectedNumbers.length} selected numbers?`
      )
    ) {

      return;

    }


    try {

      setDeleting(true);


      const res =
        await numberPoolService.bulkUnallocate(
          selectedNumbers
        );


      const count =
        res.data?.unallocated_count ||
        res.data?.data?.unallocated_count ||
        0;


      setSelectedNumbers([]);


      await loadNumbers();

      await loadStatistics();


      alert(
        `${count} numbers unallocated successfully.`
      );


    } catch (err) {

      console.error(
        "Bulk Unallocation Error:",
        err
      );


      console.error(
        "Bulk Unallocation Response:",
        err.response?.data
      );


      alert(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to unallocate selected numbers."
      );

    } finally {

      setDeleting(false);

    }

  };


  // =====================================================
  // SINGLE DELETE
  // =====================================================

  const deleteNumber = async (id) => {

    try {

      setDeleting(true);


      await numberPoolService.deleteNumber(
        id
      );


      setShowDelete(false);

      setSelectedNumber(null);


      setSelectedNumbers(
        (prev) =>
          prev.filter(
            (numberId) =>
              numberId !== id
          )
      );


      if (
        numbers.length === 1 &&
        currentPage > 1
      ) {

        setCurrentPage(
          (page) =>
            Math.max(
              1,
              page - 1
            )
        );

      } else {

        await loadNumbers();

      }


      await loadStatistics();


    } catch (err) {

      console.error(
        "Delete Number Error:",
        err
      );


      console.error(
        "Delete Response:",
        err.response?.data
      );


      alert(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to delete number."
      );

    } finally {

      setDeleting(false);

    }

  };


  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {

    setSearch("");

    setCountry("");

    setCarrier("");

    setStatus("");

    setCurrentPage(1);

    setSelectedNumbers([]);

  };


  // =====================================================
  // PAGE SIZE
  // =====================================================

  const handlePageSizeChange = (e) => {

    const value =
      e.target.value;

    const newSize =
      value === "all"
        ? "all"
        : Number(value);

    setPageSize(newSize);

    setCurrentPage(1);

  };


  // =====================================================
  // PREVIOUS
  // =====================================================

  const goPrevious = () => {

    if (
      pagination.previous !== null &&
      currentPage > 1
    ) {

      setCurrentPage(
        (page) =>
          page - 1
      );

    }

  };


  // =====================================================
  // NEXT
  // =====================================================

  const goNext = () => {

    if (
      pagination.next !== null &&
      currentPage <
        pagination.total_pages
    ) {

      setCurrentPage(
        (page) =>
          page + 1
      );

    }

  };


  // =====================================================
  // ALLOCATION SUCCESS
  // =====================================================

  const handleAllocationSuccess =
    async () => {

      setShowAllocation(false);

      await loadNumbers();

      await loadStatistics();

    };


  // =====================================================
  // PAGINATION DISPLAY
  // =====================================================

  const totalCount =
    pagination.count || 0;


  const totalPages =
    Math.max(
      1,
      pagination.total_pages || 1
    );


  const isAllPageSize =
    String(pageSize).toLowerCase() === "all";

  const effectivePageSize =
    isAllPageSize
      ? totalCount || 1
      : Number(pageSize) || 25;

  const startNumber =
    totalCount === 0
      ? 0
      : (
          (currentPage - 1) *
            effectivePageSize
        ) + 1;

  const endNumber =
    totalCount === 0
      ? 0
      : Math.min(
          currentPage *
            effectivePageSize,
          totalCount
        );


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="space-y-8">

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="mb-6 flex justify-end">

        <div
          className="
            flex
            flex-wrap
            items-center
            justify-end
            gap-3
          "
        >

          {/* =================================================
              IMPORT
          ================================================= */}

          <button
            type="button"
            onClick={openImport}
            disabled={loading}
            className="
              flex
              cursor-pointer
              items-center
              gap-2
              rounded-xl
              bg-emerald-600
              px-5
              py-3
              font-medium
              text-white
              shadow-md
              transition-all
              hover:bg-emerald-700
              hover:shadow-lg
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Upload size={18} />
            <span>Import Numbers</span>
          </button>


          {/* =================================================
              ADD
          ================================================= */}

          <button
            type="button"
            onClick={openCreate}
            disabled={saving}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              px-5
              py-3
              font-medium
              text-white
              shadow-md
              transition-all
              hover:scale-[1.02]
              hover:shadow-xl
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            <Plus size={18} />

            Add Number

          </button>


          {/* =================================================
              REFRESH
          ================================================= */}

          <button
            type="button"
            onClick={async () => {

              await Promise.all([
                loadNumbers(),
                loadStatistics(),
              ]);

            }}
            disabled={loading}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-300
              bg-white
              px-5
              py-3
              text-slate-700
              shadow-sm
              transition-all
              hover:bg-slate-100
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-200
              dark:hover:bg-slate-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >

            <RefreshCw
              size={18}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>


          {/* =================================================
              ALLOCATE
          ================================================= */}

          <button
            type="button"
            onClick={
              openAllocation
            }
            disabled={
              selectedNumbers.length === 0 ||
              deleting
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-emerald-600
              px-5
              py-3
              font-medium
              text-white
              shadow-md
              transition-all
              hover:bg-emerald-700
              disabled:cursor-not-allowed
              disabled:bg-emerald-300
            "
          >

            <Plus size={18} />

            Allocate

            {selectedNumbers.length > 0 &&
              ` (${selectedNumbers.length})`}

          </button>


          {/* =================================================
              UNALLOCATE
          ================================================= */}

          <button
            type="button"
            onClick={
              handleBulkUnallocate
            }
            disabled={
              selectedNumbers.length === 0 ||
              deleting
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-orange-500
              px-5
              py-3
              font-medium
              text-white
              shadow-md
              transition-all
              hover:bg-orange-600
              disabled:cursor-not-allowed
              disabled:bg-orange-300
            "
          >

            <Undo2 size={18} />

            Unallocate

            {selectedNumbers.length > 0 &&
              ` (${selectedNumbers.length})`}

          </button>


          {/* =================================================
              DELETE
          ================================================= */}

          <button
            type="button"
            onClick={
              handleBulkDelete
            }
            disabled={
              selectedNumbers.length === 0 ||
              deleting
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-red-600
              px-5
              py-3
              font-medium
              text-white
              shadow-md
              transition-all
              hover:bg-red-700
              disabled:cursor-not-allowed
              disabled:bg-red-300
            "
          >

            <Trash2 size={18} />

            Delete

            {selectedNumbers.length > 0 &&
              ` (${selectedNumbers.length})`}

          </button>

        </div>

      </div>


      {/* =================================================
          STATISTICS
      ================================================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          sm:grid-cols-2
          xl:grid-cols-5
        "
      >

        {/* TOTAL */}

        <StatCard
          label="Total Numbers"
          value={stats.total}
          className="
            border-slate-200
            bg-white
            dark:border-slate-800
            dark:bg-slate-900
            text-slate-900
            dark:text-white
          "
        />


        {/* AVAILABLE */}

        <StatCard
          label="Available"
          value={stats.available}
          className="
            border-emerald-500/20
            bg-emerald-500/10
            text-emerald-600
          "
        />


        {/* ASSIGNED */}

        <StatCard
          label="Assigned"
          value={stats.assigned}
          className="
            border-blue-500/20
            bg-blue-500/10
            text-blue-600
          "
        />


        {/* RESERVED */}

        <StatCard
          label="Reserved"
          value={stats.reserved}
          className="
            border-yellow-500/20
            bg-yellow-500/10
            text-yellow-600
          "
        />


        {/* DISABLED */}

        <StatCard
          label="Disabled"
          value={stats.disabled}
          className="
            border-red-500/20
            bg-red-500/10
            text-red-600
          "
        />

      </div>


      {/* =================================================
          FILTERS
      ================================================= */}

      <div
        className="
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-900
        "
      >

        <div
          className="
            grid
            grid-cols-1
            gap-4
            md:grid-cols-2
            xl:grid-cols-5
          "
        >

          {/* SEARCH */}

          <div
            className="
              relative
              xl:col-span-2
            "
          >

            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />


            <input
              type="text"
              placeholder="Search DID, Client..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-slate-50
                py-3
                pl-11
                pr-4
                text-slate-900
                outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/20
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-white
              "
            />

          </div>


          {/* COUNTRY */}

          <div className="relative">

            <Globe
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />


            <select
              value={country}
              onChange={(e) =>
                setCountry(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-slate-50
                py-3
                pl-11
                pr-4
                text-slate-900
                outline-none
                focus:border-blue-500
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-white
              "
            >

              <option value="">
                All Countries
              </option>


              {countries.map(
                (item) => (

                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>

                )
              )}

            </select>

          </div>


          {/* CARRIER */}

          <div className="relative">

            <Truck
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />


            <select
              value={carrier}
              onChange={(e) =>
                setCarrier(
                  e.target.value
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-slate-300
                bg-slate-50
                py-3
                pl-11
                pr-4
                text-slate-900
                outline-none
                focus:border-blue-500
                dark:border-slate-700
                dark:bg-slate-950
                dark:text-white
              "
            >

              <option value="">
                All Carriers
              </option>


              {carriers.map(
                (item) => (

                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>

                )
              )}

            </select>

          </div>


          {/* STATUS */}

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value
              )
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              bg-slate-50
              px-4
              py-3
              text-slate-900
              outline-none
              focus:border-blue-500
              dark:border-slate-700
              dark:bg-slate-950
              dark:text-white
            "
          >

            <option value="">
              All Status
            </option>


            <option value="AVAILABLE">
              🟢 Available
            </option>


            <option value="ASSIGNED">
              🔵 Assigned
            </option>


            <option value="RESERVED">
              🟡 Reserved
            </option>


            <option value="DISABLED">
              🔴 Disabled
            </option>

          </select>

        </div>


        {/* FILTER FOOTER */}

        <div
          className="
            mt-6
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          "
        >

          <div
            className="
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >

            Showing

            <span
              className="
                mx-2
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              {startNumber}
              {" - "}
              {endNumber}
            </span>

            of {totalCount} Numbers


            {selectedNumbers.length > 0 && (

              <span
                className="
                  ml-4
                  font-semibold
                  text-blue-600
                  dark:text-blue-400
                "
              >

                {selectedNumbers.length}
                {" "}
                Selected

              </span>

            )}

          </div>


          <button
            type="button"
            onClick={
              clearFilters
            }
            className="
              rounded-xl
              bg-slate-800
              px-5
              py-3
              text-white
              transition-all
              hover:bg-slate-700
            "
          >
            Clear Filters
          </button>

        </div>

      </div>


      {/* =================================================
          INVENTORY
      ================================================= */}

      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-sm
          dark:border-slate-800
          dark:bg-slate-900
        "
      >

        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            gap-5
            border-b
            border-slate-200
            px-6
            py-5
            lg:flex-row
            lg:items-center
            lg:justify-between
            dark:border-slate-800
          "
        >

          <div>

            <h3
              className="
                text-xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              DID Inventory
            </h3>


            <p
              className="
                mt-2
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Manage assigned and available phone numbers
            </p>

          </div>


          {/* PAGE SIZE */}

          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-2
              dark:border-slate-700
              dark:bg-slate-950
            "
          >

            <span
              className="
                text-sm
                font-medium
                text-slate-600
                dark:text-slate-300
              "
            >
              Rows per page
            </span>


            <select
              value={pageSize}
              onChange={
                handlePageSizeChange
              }
              className="
                rounded-lg
                border
                border-slate-300
                bg-white
                px-3
                py-2
                text-sm
                font-semibold
                text-slate-900
                outline-none
                focus:border-blue-500
                dark:border-slate-700
                dark:bg-slate-900
                dark:text-white
              "
            >

              <option value={25}>
                25
              </option>

              <option value={50}>
                50
              </option>

              <option value={100}>
                100
              </option>

              <option value={500}>
                500
              </option>

              <option value="all">
                All
              </option>

            </select>

          </div>


          {/* TOTAL */}

          <div
            className="
              rounded-xl
              border
              border-blue-200
              bg-blue-50
              px-4
              py-2
              dark:border-blue-500/20
              dark:bg-blue-500/10
            "
          >

            <span
              className="
                text-sm
                font-medium
                text-blue-700
                dark:text-blue-300
              "
            >
              {totalCount} Numbers
            </span>

          </div>

        </div>


        {/* TABLE */}

        <div className="overflow-x-auto">

          <NumberTable
            numbers={numbers}
            loading={loading}
            onEdit={openEdit}
            onDelete={openDelete}
            user={user}
            selectedNumbers={
              selectedNumbers
            }
            setSelectedNumbers={
              setSelectedNumbers
            }
          />

        </div>


        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading &&
          totalCount > 0 && (

            <div
              className="
                flex
                flex-col
                gap-4
                border-t
                border-slate-200
                px-6
                py-4
                sm:flex-row
                sm:items-center
                sm:justify-between
                dark:border-slate-800
              "
            >

              {/* INFO */}

              <div
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >

                Showing

                <span
                  className="
                    mx-1
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {startNumber}
                </span>

                -

                <span
                  className="
                    mx-1
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {endNumber}
                </span>

                of

                <span
                  className="
                    mx-1
                    font-semibold
                    text-slate-900
                    dark:text-white
                  "
                >
                  {totalCount}
                </span>

              </div>


              {/* CONTROLS */}

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                {/* PREVIOUS */}

                <button
                  type="button"
                  onClick={
                    goPrevious
                  }
                  disabled={
                    currentPage <= 1 ||
                    pagination.previous === null
                  }
                  className="
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-3
                    py-2
                    text-sm
                    font-medium
                    hover:bg-slate-100
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:hover:bg-slate-800
                  "
                >
                  ‹ Previous
                </button>


                {/* PAGE */}

                <span
                  className="
                    min-w-[110px]
                    text-center
                    text-sm
                    font-semibold
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  Page {currentPage}
                  {" / "}
                  {totalPages}
                </span>


                {/* NEXT */}

                <button
                  type="button"
                  onClick={
                    goNext
                  }
                  disabled={
                    currentPage >= totalPages ||
                    pagination.next === null
                  }
                  className="
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-3
                    py-2
                    text-sm
                    font-medium
                    hover:bg-slate-100
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:hover:bg-slate-800
                  "
                >
                  Next ›
                </button>

              </div>

            </div>

          )}

      </div>


      {/* =================================================
          NUMBER IMPORT MODAL
      ================================================= */}

      <NumberImportModal
        open={showImport}
        onClose={() => setShowImport(false)}
        onSuccess={handleImportSuccess}
        carriers={carriers}
      />

      {/* =================================================
          NUMBER FORM
      ================================================= */}

      <NumberFormModal
        open={showForm}
        onClose={() => {

          setShowForm(false);

          setSelectedNumber(null);

        }}
        onSave={saveNumber}
        number={selectedNumber}
        user={user}
        saving={saving}
      />


      {/* =================================================
          DELETE MODAL
      ================================================= */}

      <NumberDeleteModal
        open={showDelete}
        onClose={() => {

          setShowDelete(false);

          setSelectedNumber(null);

        }}
        onConfirm={deleteNumber}
        number={selectedNumber}
        deleting={deleting}
      />


      {/* =================================================
          BULK ALLOCATION MODAL
      ================================================= */}

      <BulkAllocationModal
        open={showAllocation}
        onClose={() => {

          setShowAllocation(false);

        }}
        selectedNumbers={
          selectedNumbers
        }
        onSuccess={
          handleAllocationSuccess
        }
      />

    </div>

  );

}


// =========================================================
// STAT CARD
// =========================================================

function StatCard({
  label,
  value,
  className = "",
}) {

  return (

    <div
      className={`
        rounded-2xl
        border
        p-5
        shadow-sm
        ${className}
      `}
    >

      <p
        className="
          text-xs
          uppercase
          tracking-[0.2em]
          opacity-70
        "
      >
        {label}
      </p>


      <h2
        className="
          mt-3
          text-4xl
          font-bold
        "
      >
        {value || 0}
      </h2>

    </div>

  );

}