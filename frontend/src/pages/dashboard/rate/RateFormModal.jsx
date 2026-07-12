import { useEffect, useState } from "react";
import { getCountries } from "../../../services/countryService";

export default function RateFormModal({
    open,
    onClose,
    onSave,
    rate,
    saving = false,
}) {

    const emptyForm = {
        country: "",
        destination: "",
        prefix: "",
        provider: "",
        buy_rate: "",
        sell_rate: "",
        billing_block: 60,
        minimum_duration: 60,
        connection_charge: 0,
        effective_date: "",
        status: "ACTIVE",
    };

    const [form, setForm] = useState(emptyForm);

    const [countries, setCountries] = useState([]);

    useEffect(() => {

        if (!open) return;

        loadCountries();

        if (rate) {

            setForm({
                country: rate.country || "",
                destination: rate.destination || "",
                prefix: rate.prefix || "",
                provider: rate.provider || "",
                buy_rate: rate.buy_rate || "",
                sell_rate: rate.sell_rate || "",
                billing_block: rate.billing_block || 60,
                minimum_duration: rate.minimum_duration || 60,
                connection_charge: rate.connection_charge || 0,
                effective_date: rate.effective_date || "",
                status: rate.status || "ACTIVE",
            });

        } else {

            setForm(emptyForm);

        }

    }, [open, rate]);

    const loadCountries = async () => {

        try {

            const res = await getCountries();

            const data = res.data.data || res.data;

            setCountries(data);

        } catch (err) {

            console.error(err);

        }

    };

    // Country Change
    const handleCountryChange = (e) => {

        const id = Number(e.target.value);

        const country = countries.find(
            (c) => c.id === id
        );

        setForm((prev) => ({
            ...prev,
            country: id,
        }));

    };

    // Destination Change
    const handleDestinationChange = (e) => {

        const destination = e.target.value;

        const selectedCountry = countries.find(
            (c) => c.name === destination
        );

        setForm((prev) => ({
            ...prev,
            destination,
            prefix: selectedCountry?.dial_code || "",
        }));

    };

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const submit = (e) => {

        e.preventDefault();

        if (saving) return;

        onSave(form);

    };

    if (!open) return null;
    return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-3xl p-6">

            <h2 className="text-2xl font-bold mb-6">
                {rate ? "Edit Rate" : "Create Rate"}
            </h2>

            <form
                onSubmit={submit}
                className="grid grid-cols-2 gap-4"
            >

                {/* Country */}

                <select
                    name="country"
                    value={form.country}
                    onChange={handleCountryChange}
                    className="border rounded-lg p-3"
                    required
                >

                    <option value="">
                        Select Country
                    </option>

                    {countries.map((country) => (

                        <option
                            key={country.id}
                            value={country.id}
                        >
                            {country.name}
                        </option>

                    ))}

                </select>

                {/* Destination */}

                <select
                    name="destination"
                    value={form.destination}
                    onChange={handleDestinationChange}
                    className="border rounded-lg p-3"
                    required
                >

                    <option value="">
                        Select Destination
                    </option>

                    {countries.map((country) => (

                        <option
                            key={country.id}
                            value={country.name}
                        >
                            {country.name}
                        </option>

                    ))}

                </select>

                {/* Prefix */}

                <input
                    name="prefix"
                    value={form.prefix}
                    readOnly
                    placeholder="Prefix"
                    className="border rounded-lg p-3 bg-slate-100 dark:bg-slate-800"
                />

                {/* Provider */}

                <input
                    name="provider"
                    value={form.provider}
                    onChange={handleChange}
                    placeholder="Provider"
                    className="border rounded-lg p-3"
                />

                {/* Buy Rate */}

                <input
                    type="number"
                    step="0.000001"
                    name="buy_rate"
                    value={form.buy_rate}
                    onChange={handleChange}
                    placeholder="Buy Rate"
                    className="border rounded-lg p-3"
                    required
                />

                {/* Sell Rate */}

                <input
                    type="number"
                    step="0.000001"
                    name="sell_rate"
                    value={form.sell_rate}
                    onChange={handleChange}
                    placeholder="Sell Rate"
                    className="border rounded-lg p-3"
                    required
                />                {/* Billing Block */}

                <select
                    name="billing_block"
                    value={form.billing_block}
                    onChange={handleChange}
                    className="border rounded-lg p-3"
                >
                    <option value={1}>1 / 1</option>
                    <option value={6}>6 / 6</option>
                    <option value={30}>30 / 30</option>
                    <option value={60}>60 / 60</option>
                </select>

                {/* Minimum Duration */}

                <input
                    type="number"
                    name="minimum_duration"
                    value={form.minimum_duration}
                    onChange={handleChange}
                    placeholder="Minimum Duration"
                    className="border rounded-lg p-3"
                />

                {/* Connection Charge */}

                <input
                    type="number"
                    step="0.000001"
                    name="connection_charge"
                    value={form.connection_charge}
                    onChange={handleChange}
                    placeholder="Connection Charge"
                    className="border rounded-lg p-3"
                />

                {/* Effective Date */}

                <input
                    type="date"
                    name="effective_date"
                    value={form.effective_date}
                    onChange={handleChange}
                    className="border rounded-lg p-3"
                    required
                />

                {/* Status */}

                <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="border rounded-lg p-3 col-span-2"
                >
                    <option value="ACTIVE">
                        Active
                    </option>

                    <option value="INACTIVE">
                        Inactive
                    </option>

                </select>

                <div className="col-span-2 flex justify-end gap-3 mt-4">

                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg bg-slate-300 hover:bg-slate-400"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : rate
                                ? "Update Rate"
                                : "Create Rate"}
                    </button>

                </div>

            </form>

        </div>

    </div>

);
}