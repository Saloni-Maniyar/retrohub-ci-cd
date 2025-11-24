import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/verify.css"
export default function VerifyFailed() {
  const navigate = useNavigate();

  return (
    <div className="verify-page">
      <XCircle size={60} color="red" />
      <h2>Verification Failed</h2>
      <p>The link may be invalid or expired. Please try signing up again.</p>
      <button onClick={() => navigate("/signup")}>Back to Signup</button>
    </div>
  );
}
