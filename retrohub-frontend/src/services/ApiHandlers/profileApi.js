import axios from "axios";

const token = sessionStorage.getItem("token");

export async function getProfileApi() {
  const res = await axios.get("http://localhost:5001/api/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function updateProfileApi({ name, email }) {
  const res = await axios.put(
    "http://localhost:5001/api/profile",
    { name, email },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function changePasswordApi({ oldPassword, newPassword }) {
  const res = await axios.put(
    "http://localhost:5001/api/change-password",
    { oldPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function forgotPasswordApi({ email }) {
  const res = await axios.post(
    "http://localhost:5001/api/forgot-password",
    { email }
  );
  return res.data;
}

export async function resetPasswordApi({ token, newPassword }) {
  const res = await axios.post(
    `http://localhost:5001/api/reset-password/${token}`,
    { newPassword }
  );
  return res.data;
}
