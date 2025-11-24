import { useState,useEffect} from "react";
import { handleSignup } from "../services/Validations/handleSignup";
import "../styles/Signup.css";
import handleConfirmPasswordError from "../services/Validations/handleConfirmPasswordError";
import {SignupApi} from "../services/ApiHandlers/SignupApi"
import { useNavigate,useSearchParams } from "react-router-dom";


export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError,setConfirmPasswordError]=useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError,setNameError]=useState('');
  const [emailError,setEmailError]=useState('');
  const [signupSuccessMessage,setSignupSuccessMessage]=useState("");
  const [signupError,setSignupError]=useState("");
  const [formDisabled, setFormDisabled] = useState(false);

  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("teamId");
  const inviteEmail = searchParams.get("email");
  const navigate=useNavigate();

  useEffect(() => {
      if (inviteEmail) setEmail(inviteEmail);
  }, [inviteEmail]);

  const handleSubmit = async (e) => {
      e.preventDefault();
    
      const  { nameErr,emailErr,passwordErr,confirmPasswordErr}= await handleSignup({ name, email, password,confirmPassword});
      setNameError(nameErr);
      setEmailError(emailErr);
      setPasswordError(passwordErr);
      setConfirmPasswordError(confirmPasswordErr);
   if(!nameErr && !emailErr && !passwordErr && !confirmPasswordErr){
        try{

           const data=await SignupApi({name,email,password,teamId});
           console.log('done signup api call in try');
           console.log(data);
           
           setSignupError("");
           if(data.joinedTeam){
                  setSignupSuccessMessage("Signup successful! You are now a member of the team. Please login to continue.");
                  setTimeout(() => {
                          navigate(`/login?email=${encodeURIComponent(email)}&msg=${encodeURIComponent("Signup successful! Login to see your team.")}`);
                  }, 2000);
           }else{
                  setSignupSuccessMessage("Signup Successful! Verification email sent. Check your inbox.");

           }
           setFormDisabled(true);
           console.log(signupError);
           console.log(signupSuccessMessage);
           
           setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
        
              
        }catch(err){
          console.log(err);
          console.log("In catch of signup component")
          setSignupError(err.response?.data?.message || "Signup failed");
          setSignupSuccessMessage('');
        }
   }

   
  };
  
 
  return (
    <div className="Signup">
      <div className="SignupMessage">
        {console.log("success message",{signupSuccessMessage})}
        {console.log("signuperror",{signupError})}

        
        {signupSuccessMessage && (<div>
          <p className="signupSuccessMessage">{signupSuccessMessage}</p>
          <button 
              onClick={() => navigate('/Login')}
              className="go-to-login-btn"
            >
              Go to Login
            </button>
        </div>)}
        {signupError && <p className="signuperror">{signupError}</p>}

        
      </div>
     
      <div className="signup-card">
        
        <h2>Create Your Account</h2>
        {/* <p>Join RetroHub and start collaborating!</p> */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={formDisabled}
            required
          />
           {nameError && <p className="error">{nameError}</p>}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={formDisabled}
            required
          />
           {emailError && <p className="error">{emailError}</p>}
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={formDisabled}
            required
          />
           {passwordError && <p className="error">{passwordError}</p>}
          <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e)=>{
              const value=e.target.value;
              setConfirmPassword(value);
              console.log('target ',value);
              const err=handleConfirmPasswordError({password,confirmPassword:value});
              console.log("error=",err);
              if(err){
                console.log("password and confirm password does not match",err);
                setConfirmPasswordError(err);
              }else{
                setConfirmPasswordError("");
              }
              
          }}
          disabled={formDisabled}
          required
          />

        {confirmPasswordError && <p className="error">{confirmPasswordError}</p>}

          <button type="submit" disabled={formDisabled}>Sign Up</button>
           <p className="login-link">
          Already have an account? <a href="/Login">Login</a>
        </p>
        </form>
       
      </div>
    </div>
  );
}

