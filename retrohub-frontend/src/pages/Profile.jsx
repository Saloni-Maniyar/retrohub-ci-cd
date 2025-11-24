import { useState, useEffect } from "react";
import "../styles/Profile.css";
import {
  getProfileApi,
  updateProfileApi,
  changePasswordApi,
} from "../services/ApiHandlers/profileApi";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");

  const [updateMsg, setUpdateMsg] = useState("");

  // Password change fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordMsg, setPasswordMsg] = useState("");

  const navigate = useNavigate();

  // FETCH PROFILE DATA
  useEffect(() => {
    async function fetchProfile() {
      const data = await getProfileApi();

      console.log("Loaded profile:", data.user);

      setUser(data.user);
      setName(data.user.name || ""); // pre-fill
    }
    fetchProfile();
  }, []);

  // UPDATE PROFILE NAME ONLY
  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      return setUpdateMsg("Name cannot be empty.");
    }

    const res = await updateProfileApi({ name });
    setUpdateMsg(res.message);
  };

  // CHANGE PASSWORD
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return setPasswordMsg("All fields are required.");
    }

    if (newPassword.length < 8) {
      return setPasswordMsg("New password must be at least 8 characters.");
    }

    if (newPassword !== confirmPassword) {
      return setPasswordMsg("New passwords do not match.");
    }

    try {
      const res = await changePasswordApi({ oldPassword, newPassword });
      setPasswordMsg(res.message);

      // Clear fields on success
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg(err.response?.data?.message || "Error updating password");
    }
  };

  return (
    <div className="profile-page">

      {/* LEFT CARD — PROFILE INFO */}
      <div className="profile-card">
        <h2>My Profile</h2>

        <label>Name</label>
        <input
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email (cannot be changed)</label>
        <input
          value={user.email || ""}
          readOnly
          className="readonly-input"
        />

        <button onClick={handleUpdateProfile}>Save Changes</button>

        {updateMsg && (
          <p className={updateMsg.includes("empty") ? "error-text" : "success-text"}>
            {updateMsg}
          </p>
        )}
      </div>

      {/* RIGHT CARD — CHANGE PASSWORD */}
      <div className="password-card">
        <h3>Change Password</h3>

        <label>Current Password</label>
        <input
          type="password"
          placeholder="Enter current password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <label>Confirm New Password</label>
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleChangePassword}>Update Password</button>

        {passwordMsg && (
          <p
            className={
              passwordMsg.includes("incorrect") ||
              passwordMsg.includes("match") ||
              passwordMsg.includes("required") ||
              passwordMsg.includes("least")
                ? "error-text"
                : "success-text"
            }
          >
            {passwordMsg}
          </p>
        )}

        <p
          className="forgot-pass-link"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>
      </div>
    </div>
  );
}
