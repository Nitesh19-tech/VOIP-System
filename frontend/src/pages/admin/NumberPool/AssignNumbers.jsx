import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    CheckCircle2,
    CircleDollarSign,
    Hash,
    Loader2,
    RefreshCw,
    Server,
    Users,
    XCircle,
} from "lucide-react";

import numberPoolService from "../../../services/numberPoolService";
import clientService from "../../../services/clientService";
import { getCarriers } from "../../../services/carrierService";
import { getTerminations } from "../../../services/terminationService";


const PAYMENT_TERMS = [
    "Daily",
    "Weekly",
    "Weekly7",
    "Monthly30",
    "Monthly45",
    "Monthly60",
];


const INITIAL_FORM = {
    carrier: "",
    termination: "",
    client: "",
    prefix: "",
    payment_term: "",
    quantity: 1,
};


export default function AssignNumbers({
    onBack,
    onSuccess,
}) {

    // =====================================================
    // STATE
    // =====================================================

    const [form, setForm] =
        useState(INITIAL_FORM);

    const [carriers, setCarriers] =
        useState([]);

    const [terminations, setTerminations] =
        useState([]);

    const [clients, setClients] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [loadingTerminations, setLoadingTerminations] =
        useState(false);

    const [assigning, setAssigning] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [result, setResult] =
        useState(null);


    // =====================================================
    // LOAD INITIAL DATA
    // =====================================================

    useEffect(() => {

        loadInitialData();

    }, []);


    const loadInitialData = async () => {

        setLoading(true);
        setError("");

        try {

            const [
                carrierResponse,
                clientResponse,
            ] = await Promise.all([
                getCarriers(),
                clientService.getClients(),
            ]);


            const carrierData =
                carrierResponse?.data?.data ||
                carrierResponse?.data?.results ||
                carrierResponse?.data ||
                [];


            const clientData =
                clientResponse?.data?.data ||
                clientResponse?.data?.results ||
                clientResponse?.data ||
                [];


            setCarriers(
                Array.isArray(carrierData)
                    ? carrierData
                    : []
            );


            setClients(
                Array.isArray(clientData)
                    ? clientData
                    : []
            );

        } catch (err) {

            console.error(
                "Assign Page Load Error:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Unable to load carrier/client data."
                )
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // LOAD TERMINATIONS
    // =====================================================

    const loadTerminations = async (
        carrierId
    ) => {

        if (!carrierId) {

            setTerminations([]);

            return;

        }


        setLoadingTerminations(true);
        setError("");

        try {

            const response =
                await getTerminations({
                    is_active: true,
                    carrier: carrierId,
                });


            const data =
                response?.data?.data ||
                response?.data?.results ||
                response?.data ||
                [];


            const filtered =
                Array.isArray(data)
                    ? data.filter(
                        (item) =>
                            Number(
                                item.carrier
                            ) === Number(
                                carrierId
                            )
                    )
                    : [];


            setTerminations(filtered);

        } catch (err) {

            console.error(
                "Termination Load Error:",
                err
            );

            setTerminations([]);

            setError(
                getErrorMessage(
                    err,
                    "Unable to load terminations."
                )
            );

        } finally {

            setLoadingTerminations(false);

        }
    };


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;


        setMessage("");
        setError("");
        setResult(null);


        if (name === "carrier") {

            setForm(
                (previous) => ({
                    ...previous,

                    carrier: value,

                    termination: "",

                    payment_term: "",

                    prefix: "",
                })
            );


            loadTerminations(value);

            return;

        }


        if (name === "termination") {

            const selected =
                terminations.find(
                    (item) =>
                        String(item.id) ===
                        String(value)
                );


            setForm(
                (previous) => ({
                    ...previous,

                    termination: value,

                    payment_term:
                        selected?.payment_term ||
                        "",

                    prefix:
                        selected?.prefix ||
                        "",
                })
            );

            return;

        }


        setForm(
            (previous) => ({
                ...previous,

                [name]: value,
            })
        );

    };


    // =====================================================
    // SELECTED TERMINATION
    // =====================================================

    const selectedTermination =
        useMemo(
            () =>
                terminations.find(
                    (item) =>
                        String(item.id) ===
                        String(form.termination)
                ),
            [
                terminations,
                form.termination,
            ]
        );


    // =====================================================
    // PAYOUT
    // =====================================================

    const payout = useMemo(() => {

        if (!selectedTermination) {

            return "";

        }


        const map = {
            Daily:
                selectedTermination.daily_payout,

            Weekly:
                selectedTermination.weekly_payout,

            Weekly7:
                selectedTermination.weekly7_payout,

            Monthly30:
                selectedTermination.monthly30_payout,

            Monthly45:
                selectedTermination.monthly45_payout,

            Monthly60:
                selectedTermination.monthly60_payout,
        };


        return (
            map[form.payment_term] ??
            ""
        );

    }, [
        selectedTermination,
        form.payment_term,
    ]);


    // =====================================================
    // VALIDATION
    // =====================================================

    const validate = () => {

        if (!form.carrier) {

            return "Please select a carrier.";

        }


        if (!form.termination) {

            return "Please select a termination.";

        }


        if (!form.payment_term) {

            return "Please select a payment term.";

        }


        const quantity =
            Number(form.quantity);


        if (
            !Number.isInteger(quantity) ||
            quantity < 1
        ) {

            return "Quantity must be at least 1.";

        }


        if (
            selectedTermination?.payment_term &&
            selectedTermination.payment_term !==
                form.payment_term
        ) {

            return (
                "Selected payment term does not match "
                + "the selected termination."
            );

        }


        return "";

    };


    // =====================================================
    // ASSIGN
    // =====================================================

    const handleAssign = async () => {

        setMessage("");
        setError("");
        setResult(null);


        const validationError =
            validate();


        if (validationError) {

            setError(
                validationError
            );

            return;

        }


        const payload = {

            carrier:
                Number(form.carrier),

            termination:
                Number(form.termination),

            // Client is intentionally optional.
            client:
                form.client
                    ? Number(form.client)
                    : null,

            quantity:
                Number(form.quantity),

            prefix:
                String(
                    form.prefix || ""
                ).trim(),

            payment_term:
                form.payment_term,
        };


        setAssigning(true);


        try {

            const response =
                await numberPoolService.autoAssign(
                    payload
                );


            const responseData =
                response?.data || {};


            const data =
                responseData.data ||
                responseData.result ||
                responseData;


            const allocated =
                Number(
                    data.allocated ??
                    responseData.allocated_count ??
                    0
                );


            setResult(data);


            setMessage(
                responseData.message ||
                `${allocated} numbers assigned successfully.`
            );


            if (onSuccess) {

                await onSuccess(
                    data
                );

            }

        } catch (err) {

            console.error(
                "Assign Numbers Error:",
                err
            );

            setError(
                getErrorMessage(
                    err,
                    "Unable to assign numbers."
                )
            );

        } finally {

            setAssigning(false);

        }

    };


    // =====================================================
    // RESET
    // =====================================================

    const handleReset = () => {

        setForm(
            INITIAL_FORM
        );

        setTerminations([]);

        setMessage("");

        setError("");

        setResult(null);

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="
                flex
                min-h-[420px]
                items-center
                justify-center
            ">

                <div className="
                    flex
                    items-center
                    gap-3
                    text-slate-500
                ">

                    <Loader2
                        size={22}
                        className="animate-spin"
                    />

                    Loading assign page...

                </div>

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="
            min-h-full
            bg-slate-50
            dark:bg-slate-950
            p-4
            sm:p-6
        ">

            <div className="
                mx-auto
                max-w-5xl
            ">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="
                    mb-6
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                ">

                    <div className="
                        flex
                        items-center
                        gap-3
                    ">

                        {onBack && (

                            <button
                                type="button"
                                onClick={onBack}
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    text-slate-600
                                    shadow-sm
                                    transition
                                    hover:bg-slate-100
                                    dark:border-slate-800
                                    dark:bg-slate-900
                                    dark:text-slate-300
                                    dark:hover:bg-slate-800
                                "
                            >

                                <ArrowLeft
                                    size={19}
                                />

                            </button>

                        )}


                        <div>

                            <h1 className="
                                text-2xl
                                font-bold
                                text-slate-900
                                dark:text-white
                            ">

                                Assign Numbers

                            </h1>

                            <p className="
                                mt-1
                                text-sm
                                text-slate-500
                                dark:text-slate-400
                            ">

                                Assign available DID numbers
                                to a carrier and termination.

                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={loadInitialData}
                        disabled={loading}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-slate-700
                            shadow-sm
                            transition
                            hover:bg-slate-50
                            disabled:opacity-50
                            dark:border-slate-800
                            dark:bg-slate-900
                            dark:text-slate-200
                            dark:hover:bg-slate-800
                        "
                    >

                        <RefreshCw
                            size={17}
                        />

                        Refresh

                    </button>

                </div>


                {/* =================================================
                    ALERTS
                ================================================= */}

                {error && (

                    <div className="
                        mb-5
                        flex
                        items-start
                        gap-3
                        rounded-2xl
                        border
                        border-red-200
                        bg-red-50
                        p-4
                        text-sm
                        text-red-700
                        dark:border-red-500/30
                        dark:bg-red-500/10
                        dark:text-red-300
                    ">

                        <XCircle
                            size={19}
                            className="mt-0.5 shrink-0"
                        />

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {message && (

                    <div className="
                        mb-5
                        flex
                        items-start
                        gap-3
                        rounded-2xl
                        border
                        border-emerald-200
                        bg-emerald-50
                        p-4
                        text-sm
                        text-emerald-700
                        dark:border-emerald-500/30
                        dark:bg-emerald-500/10
                        dark:text-emerald-300
                    ">

                        <CheckCircle2
                            size={19}
                            className="mt-0.5 shrink-0"
                        />

                        <span>
                            {message}
                        </span>

                    </div>

                )}


                {/* =================================================
                    FORM
                ================================================= */}

                <div className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                    dark:border-slate-800
                    dark:bg-slate-900
                ">

                    <div className="
                        border-b
                        border-slate-200
                        px-6
                        py-5
                        dark:border-slate-800
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">

                            <div className="
                                flex
                                h-11
                                w-11
                                items-center
                                justify-center
                                rounded-xl
                                bg-indigo-100
                                text-indigo-600
                                dark:bg-indigo-500/15
                                dark:text-indigo-400
                            ">

                                <Server
                                    size={21}
                                />

                            </div>

                            <div>

                                <h2 className="
                                    font-semibold
                                    text-slate-900
                                    dark:text-white
                                ">

                                    Allocation Details

                                </h2>

                                <p className="
                                    text-xs
                                    text-slate-500
                                    dark:text-slate-400
                                ">

                                    Choose where the available
                                    numbers should be assigned.

                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="
                        grid
                        gap-5
                        p-6
                        md:grid-cols-2
                    ">

                        {/* CARRIER */}

                        <Field
                            label="Carrier"
                            required
                        >

                            <select
                                name="carrier"
                                value={form.carrier}
                                onChange={handleChange}
                                className={inputClass}
                            >

                                <option value="">
                                    Select Carrier
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

                        </Field>


                        {/* TERMINATION */}

                        <Field
                            label="Termination"
                            required
                        >

                            <select
                                name="termination"
                                value={form.termination}
                                onChange={handleChange}
                                disabled={
                                    !form.carrier ||
                                    loadingTerminations
                                }
                                className={inputClass}
                            >

                                <option value="">

                                    {loadingTerminations
                                        ? "Loading..."
                                        : !form.carrier
                                            ? "Select Carrier First"
                                            : "Select Termination"}

                                </option>

                                {terminations.map(
                                    (item) => (

                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >

                                            {item.name}

                                            {item.prefix
                                                ? ` — ${item.prefix}`
                                                : ""}

                                        </option>

                                    )
                                )}

                            </select>

                        </Field>


                        {/* PREFIX */}

                        <Field
                            label="Termination Prefix"
                            hint="Optional"
                        >

                            <div className="
                                relative
                            ">

                                <Hash
                                    size={17}
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />

                                <input
                                    type="text"
                                    name="prefix"
                                    value={form.prefix}
                                    onChange={handleChange}
                                    placeholder="Enter prefix..."
                                    className={`${inputClass} pl-10`}
                                />

                            </div>

                        </Field>


                        {/* CLIENT */}

                        <Field
                            label="Client"
                            hint="Optional"
                        >

                            <div className="
                                relative
                            ">

                                <Users
                                    size={17}
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />

                                <select
                                    name="client"
                                    value={form.client}
                                    onChange={handleChange}
                                    className={`${inputClass} pl-10`}
                                >

                                    <option value="">
                                        No Client
                                    </option>

                                    {clients.map(
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

                        </Field>


                        {/* PAYMENT TERM */}

                        <Field
                            label="Payterm"
                            required
                        >

                            <select
                                name="payment_term"
                                value={form.payment_term}
                                onChange={handleChange}
                                disabled={!form.termination}
                                className={inputClass}
                            >

                                <option value="">
                                    Select Payterm
                                </option>

                                {PAYMENT_TERMS.map(
                                    (term) => (

                                        <option
                                            key={term}
                                            value={term}
                                        >
                                            {term}
                                        </option>

                                    )
                                )}

                            </select>

                            {selectedTermination?.payment_term && (

                                <p className="
                                    mt-1.5
                                    text-xs
                                    text-slate-500
                                ">

                                    Termination payterm:
                                    {" "}
                                    <span className="font-medium">
                                        {selectedTermination.payment_term}
                                    </span>

                                </p>

                            )}

                        </Field>


                        {/* PAYOUT */}

                        <Field
                            label="Payout"
                            hint="From selected termination"
                        >

                            <div className="
                                relative
                            ">

                                <CircleDollarSign
                                    size={17}
                                    className="
                                        absolute
                                        left-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-slate-400
                                    "
                                />

                                <input
                                    type="text"
                                    value={
                                        payout !== ""
                                            ? payout
                                            : "0.0000"
                                    }
                                    readOnly
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        px-10
                                        py-3
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        dark:border-slate-700
                                        dark:bg-slate-800
                                        dark:text-slate-200
                                    "
                                />

                            </div>

                        </Field>


                        {/* QUANTITY */}

                        <Field
                            label="Numbers from termination"
                            required
                        >

                            <input
                                type="number"
                                name="quantity"
                                min="1"
                                step="1"
                                value={form.quantity}
                                onChange={handleChange}
                                className={inputClass}
                            />

                            <p className="
                                mt-1.5
                                text-xs
                                text-slate-500
                            ">

                                Number of available DIDs to
                                assign.

                            </p>

                        </Field>

                    </div>


                    {/* =================================================
                        SUMMARY
                    ================================================= */}

                    <div className="
                        mx-6
                        mb-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        p-5
                        dark:border-slate-800
                        dark:bg-slate-950/60
                    ">

                        <div className="
                            grid
                            gap-4
                            sm:grid-cols-3
                        ">

                            <SummaryItem
                                label="Carrier"
                                value={
                                    carriers.find(
                                        (item) =>
                                            String(item.id) ===
                                            String(form.carrier)
                                    )?.name ||
                                    "-"
                                }
                            />

                            <SummaryItem
                                label="Termination"
                                value={
                                    selectedTermination?.name ||
                                    "-"
                                }
                            />

                            <SummaryItem
                                label="Quantity"
                                value={
                                    form.quantity || "0"
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="
                        flex
                        flex-col-reverse
                        gap-3
                        border-t
                        border-slate-200
                        px-6
                        py-5
                        sm:flex-row
                        sm:justify-end
                        dark:border-slate-800
                    ">

                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={assigning}
                            className="
                                rounded-xl
                                border
                                border-slate-300
                                bg-white
                                px-5
                                py-3
                                text-sm
                                font-medium
                                text-slate-700
                                transition
                                hover:bg-slate-100
                                disabled:opacity-50
                                dark:border-slate-700
                                dark:bg-slate-900
                                dark:text-slate-200
                                dark:hover:bg-slate-800
                            "
                        >

                            Reset

                        </button>


                        <button
                            type="button"
                            onClick={handleAssign}
                            disabled={
                                assigning ||
                                !form.carrier ||
                                !form.termination
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-indigo-600
                                px-6
                                py-3
                                text-sm
                                font-semibold
                                text-white
                                shadow-lg
                                shadow-indigo-600/20
                                transition
                                hover:bg-indigo-700
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >

                            {assigning ? (

                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                    Assigning...

                                </>

                            ) : (

                                <>
                                    <CheckCircle2
                                        size={18}
                                    />

                                    Allocate Numbers

                                </>

                            )}

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}


// =========================================================
// FIELD
// =========================================================

function Field({
    label,
    required = false,
    hint,
    children,
}) {

    return (

        <div>

            <div className="
                mb-2
                flex
                items-center
                justify-between
            ">

                <label className="
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-200
                ">

                    {label}

                    {required && (

                        <span className="
                            ml-1
                            text-red-500
                        ">
                            *
                        </span>

                    )}

                </label>

                {hint && (

                    <span className="
                        text-xs
                        text-slate-400
                    ">

                        {hint}

                    </span>

                )}

            </div>

            {children}

        </div>

    );

}


// =========================================================
// SUMMARY ITEM
// =========================================================

function SummaryItem({
    label,
    value,
}) {

    return (

        <div>

            <p className="
                text-xs
                font-medium
                uppercase
                tracking-wide
                text-slate-400
            ">

                {label}

            </p>

            <p className="
                mt-1
                truncate
                text-sm
                font-semibold
                text-slate-800
                dark:text-slate-100
            ">

                {value}

            </p>

        </div>

    );

}


// =========================================================
// INPUT CLASS
// =========================================================

const inputClass = `
    w-full
    rounded-xl
    border
    border-slate-200
    bg-white
    px-4
    py-3
    text-sm
    text-slate-800
    outline-none
    transition
    focus:border-indigo-500
    focus:ring-4
    focus:ring-indigo-500/10
    disabled:cursor-not-allowed
    disabled:bg-slate-100
    disabled:text-slate-400
    dark:border-slate-700
    dark:bg-slate-900
    dark:text-slate-100
    dark:focus:border-indigo-400
    dark:disabled:bg-slate-800
    dark:disabled:text-slate-500
`;


// =========================================================
// ERROR MESSAGE
// =========================================================

function getErrorMessage(
    error,
    fallback
) {

    const data =
        error?.response?.data;


    if (data?.message) {

        return data.message;

    }


    if (data?.detail) {

        return data.detail;

    }


    if (data?.error) {

        return data.error;

    }


    if (
        typeof data === "string"
    ) {

        return data;

    }


    if (
        data &&
        typeof data === "object"
    ) {

        const firstKey =
            Object.keys(data)[0];

        const firstValue =
            data[firstKey];

        if (
            Array.isArray(firstValue)
            && firstValue.length
        ) {

            return String(
                firstValue[0]
            );

        }

        if (
            typeof firstValue === "string"
        ) {

            return firstValue;

        }

    }


    return (
        error?.message ||
        fallback
    );

}