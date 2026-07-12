import { useEffect, useState } from "react";

export default function TrunkFormModal({
    open,
    onClose,
    onSave,
    trunk,
    saving = false,
}) {

    const emptyForm = {

        provider_name: "",

        host: "",

        port: 5060,

        username: "",

        password: "",

        transport: "UDP",

        status: "ACTIVE",

        qualify: true,

        nat: true,

        codecs: "ulaw,alaw",

        register_string: "",

        realm: "",

        from_user: "",

        outbound_proxy: "",

        description: "",

    };

    const [form, setForm] =
        useState(emptyForm);

    useEffect(() => {

        if (!open) return;

        if (trunk) {

            setForm({

                provider_name:
                    trunk.provider_name || "",

                host:
                    trunk.host || "",

                port:
                    trunk.port || 5060,

                username:
                    trunk.username || "",

                password:
                    "",

                transport:
                    trunk.transport || "UDP",

                status:
                    trunk.status || "ACTIVE",

                qualify:
                    trunk.qualify ?? true,

                nat:
                    trunk.nat ?? true,

                codecs:
                    trunk.codecs || "ulaw,alaw",

                register_string:
                    trunk.register_string || "",

                realm:
                    trunk.realm || "",

                from_user:
                    trunk.from_user || "",

                outbound_proxy:
                    trunk.outbound_proxy || "",

                description:
                    trunk.description || "",

            });

        } else {

            setForm(emptyForm);

        }

    }, [open, trunk]);

    if (!open) return null;

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setForm((prev) => ({

            ...prev,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,

        }));

    };

    const submit = (e) => {

        e.preventDefault();

        if (saving) return;

        onSave(form);

    };
    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-5xl p-6">

                <h2 className="text-2xl font-bold mb-6">

                    {trunk
                        ? "Edit Trunk"
                        : "Create Trunk"}

                </h2>

                <form
                    onSubmit={submit}
                    className="grid grid-cols-2 gap-4"
                >

                    <input
                        name="provider_name"
                        value={form.provider_name}
                        onChange={handleChange}
                        placeholder="Provider Name"
                        className="border rounded-lg p-3"
                        required
                    />

                    <input
                        name="host"
                        value={form.host}
                        onChange={handleChange}
                        placeholder="Host"
                        className="border rounded-lg p-3"
                        required
                    />

                    <input
                        type="number"
                        name="port"
                        value={form.port}
                        onChange={handleChange}
                        placeholder="Port"
                        className="border rounded-lg p-3"
                        required
                    />

                    <select
                        name="transport"
                        value={form.transport}
                        onChange={handleChange}
                        className="border rounded-lg p-3"
                    >

                        <option value="UDP">
                            UDP
                        </option>

                        <option value="TCP">
                            TCP
                        </option>

                        <option value="TLS">
                            TLS
                        </option>

                    </select>

                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="border rounded-lg p-3"
                    />

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="border rounded-lg p-3"
                    />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="border rounded-lg p-3"
                    >

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="INACTIVE">
                            Inactive
                        </option>

                    </select>

                    <input
                        name="codecs"
                        value={form.codecs}
                        onChange={handleChange}
                        placeholder="Codecs (ulaw,alaw)"
                        className="border rounded-lg p-3"
                    />
                    <input
                        name="register_string"
                        value={form.register_string}
                        onChange={handleChange}
                        placeholder="Register String"
                        className="border rounded-lg p-3 col-span-2"
                    />

                    <input
                        name="realm"
                        value={form.realm}
                        onChange={handleChange}
                        placeholder="Realm"
                        className="border rounded-lg p-3"
                    />

                    <input
                        name="from_user"
                        value={form.from_user}
                        onChange={handleChange}
                        placeholder="From User"
                        className="border rounded-lg p-3"
                    />

                    <input
                        name="outbound_proxy"
                        value={form.outbound_proxy}
                        onChange={handleChange}
                        placeholder="Outbound Proxy"
                        className="border rounded-lg p-3 col-span-2"
                    />

                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description"
                        rows={3}
                        className="border rounded-lg p-3 col-span-2"
                    />

                    <label className="flex items-center gap-2">

                        <input
                            type="checkbox"
                            name="nat"
                            checked={form.nat}
                            onChange={handleChange}
                        />

                        NAT Enabled

                    </label>

                    <label className="flex items-center gap-2">

                        <input
                            type="checkbox"
                            name="qualify"
                            checked={form.qualify}
                            onChange={handleChange}
                        />

                        Qualify

                    </label>

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
                                : trunk
                                    ? "Update Trunk"
                                    : "Create Trunk"}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}