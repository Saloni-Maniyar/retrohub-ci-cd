import { useState } from "react";
import { useParams } from "react-router-dom";
import { resetPasswordApi } from "../services/ApiHandlers/profileApi";
import { handleResetPassword } from "../services/Validations/handleResetPassword";
import "../styles/ResetPassword.css";

export default function ResetPassword() {
  const { token } = useParams();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [newPasswordErr, setNewPasswordErr] = useState("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState("");
  const [msg, setMsg] = useState("");

  const handleReset = async () => {
    const { newPasswordErr, confirmPasswordErr } = handleResetPassword({
      newPassword,
      confirmPassword,
    });

    setNewPasswordErr(newPasswordErr);
    setConfirmPasswordErr(confirmPasswordErr);

    if (newPasswordErr || confirmPasswordErr) return;

    try {
      const res = await resetPasswordApi({ token, newPassword });
      setMsg(res.message);

      // Clear fields after success
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="reset-container">
      <h2>Reset Your Password</h2>

      <label>New Password</label>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      {newPasswordErr && <p className="error-text">{newPasswordErr}</p>}

      <label>Confirm Password</label>
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {confirmPasswordErr && <p className="error-text">{confirmPasswordErr}</p>}

      <button onClick={handleReset}>Update Password</button>

      {msg && (
        <p className={msg.toLowerCase().includes("success") ? "success-text" : "error-text"}>
          {msg}
        </p>
      )}
    </div>
  );
}
