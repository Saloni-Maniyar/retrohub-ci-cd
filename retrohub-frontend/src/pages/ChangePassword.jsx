import { useState } from "react";
import { changePasswordApi } from "../services/ApiHandlers/profileApi";
import "../styles/ChangePassword.css";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = async () => {
    const res = await changePasswordApi({ oldPassword, newPassword });
    setMsg(res.message);
  };

  return (
    <div>
      <h2>Change Password</h2>

      <input
        type="password"
        placeholder="Old password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button onClick={handleChange}>Update Password</button>

      {msg && <p>{msg}</p>}
    </div>
  );
}
