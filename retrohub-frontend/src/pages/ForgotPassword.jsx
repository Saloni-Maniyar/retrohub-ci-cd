import { useState } from "react";
import { forgotPasswordApi } from "../services/ApiHandlers/profileApi";
import "../styles/ForgotPassword.css";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSend = async () => {
    const res = await forgotPasswordApi({ email });
    setMsg(res.message);
  };

  return (
    <div>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSend}>Send Reset Link</button>

      {msg && <p>{msg}</p>}
    </div>
  );
}
