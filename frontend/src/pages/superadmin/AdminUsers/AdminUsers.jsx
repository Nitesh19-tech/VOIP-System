import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import userService from "../../../services/userService";

import AdminTable from "./AdminTable";
import AdminFormModal from "./AdminFormModal";
import AdminDeleteModal from "./AdminDeleteModal";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await userService.getUsers();

      setUsers(res.data.data || []);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name} ${user.email} ${user.mobile}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // CREATE
  const openCreate = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  // EDIT
  const openEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  // DELETE
  const openDelete = (user) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  // SAVE
  const saveUser = async (data) => {
    try {
      setSaving(true);

      if (selectedUser) {
        const payload = { ...data };

        // Update ke time blank password mat bhejo
        if (selectedUser && !payload.password) {
          delete payload.password;
        }

        if (selectedUser) {
          await userService.updateUser(
            selectedUser.id,
            payload
          );
        } else {
          await userService.createUser(payload);
        }
      } else {
        await userService.createUser(data);
      }

      setShowForm(false);
      setSelectedUser(null);

      await loadUsers();

    } catch (err) {
      console.error("Update Error");

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);
      } else {
        console.log(err);
      }

      alert("Unable to save user.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const deleteUser = async (id) => {
    try {
      setDeleting(true);

      await userService.deleteUser(id);

      setShowDelete(false);
      setSelectedUser(null);

      await loadUsers();

    } catch (err) {
      console.error(err);
      alert("Unable to delete user.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold">
            Admin Users
          </h1>

          <p className="text-slate-500 mt-1">
            Manage system administrators.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
        >
          <Plus size={18} />
          Add Admin
        </button>

      </div>

      {/* Search */}

      <div className="relative max-w-md">

        <Search
          size={18}
          className="absolute left-3 top-3.5 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
        />

      </div>

      {/* Table */}

      <AdminTable
        users={filteredUsers}
        loading={loading}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {/* Form */}

      <AdminFormModal
        open={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedUser(null);
        }}
        onSave={saveUser}
        user={selectedUser}
        saving={saving}
      />

      {/* Delete */}

      <AdminDeleteModal
        open={showDelete}
        onClose={() => {
          setShowDelete(false);
          setSelectedUser(null);
        }}
        onConfirm={deleteUser}
        user={selectedUser}
        deleting={deleting}
      />

    </div>
  );
}