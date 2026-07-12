import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ForcePasswordChange() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("auth/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });

      alert("Password updated successfully");
      navigate("/dashboard");
    } catch (err) {
      alert("Password change failed");
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-xl text-white font-bold">
          Change Temporary Password
        </h2>

        <input
          type="password"
          placeholder="Old Password"
          className="input"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          className="input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button className="w-full bg-sky-600 py-2 rounded-lg text-white">
          Update Password
        </button>
      </form>
    </div>
  );
}