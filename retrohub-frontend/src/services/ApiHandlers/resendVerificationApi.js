import axios from "axios";

export async function resendVerificationApi({ email }) {
  const res = await axios.post("http://localhost:5001/api/auth/resend-verification", { email });
  return res.data;
}