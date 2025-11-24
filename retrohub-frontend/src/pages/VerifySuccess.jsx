import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/verify.css"
export default function VerifySuccess() {
  const navigate = useNavigate();

  return (
    <div className="verify-page">
      <CheckCircle size={60} color="green" />
      <h2>Email Verified Successfully</h2>
      <p>You can now log in to your RetroHub account.</p>
      <button onClick={() => navigate("/login")}>Go to Login</button>
    </div>
  );
}
