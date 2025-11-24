import { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {AuthContext} from "../context/AuthContext";
import { joinTeam } from "../services/ApiHandlers/JoinTeamApi";
export default function JoinTeam(){
  console.log("In join Team jsx");
    const { teamId } = useParams();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const [status, setStatus] = useState("checking");

    useEffect(()=>{
        const checkJoin=async (teamId,email)=>{
            if (!teamId || !email) return;
            try{
               const res=await joinTeam(teamId,email,token);
          
               console.log(res);
               if (res.success && res.joinedNow) {
                setStatus("joined");
                setTimeout(() => navigate("/teams"), 2000);
               } else if (res.userNotFound) {
                    sessionStorage.setItem("inviteTeamId", teamId);
                      sessionStorage.setItem("inviteEmail", email);
                     setTimeout(()=>navigate(`/signup?email=${email}&teamId=${teamId}`),2000);
             }else if (res.needLogin || (res.alreadyMember && !res.isLoggedIn)) {
              sessionStorage.setItem("inviteTeamId", teamId);
              sessionStorage.setItem("inviteEmail", email);
             setTimeout(()=>navigate(`/login?email=${email}&teamId=${teamId}`),2000);
            } else if (res.alreadyMember) {
                    setStatus("already");
                    setTimeout(() => navigate("/teams"), 2000);
            }else if (!res.success && res.message === "Team not found") {
              setStatus("notFound");
              setTimeout(()=> navigate("/"),1500);
             
        } else {
                    setStatus("error");
            }
            }catch (err) {
                console.error("Error in checkJoin:", err);
                setStatus("error");
            }
            
        };
         const storedTeamId = sessionStorage.getItem("inviteTeamId");
    const storedEmail = sessionStorage.getItem("inviteEmail");

    const teamIdToJoin = teamId || storedTeamId;
    const emailToJoin = email || storedEmail;

    if (teamIdToJoin && emailToJoin) {
      checkJoin(teamIdToJoin, emailToJoin);

      // clear stored invite after processing
      sessionStorage.removeItem("inviteTeamId");
      sessionStorage.removeItem("inviteEmail");
    } else {
      setStatus("error");
    }
    },[teamId, email, token, navigate]);
     return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {status === "checking" && <p>Checking your invite...</p>}
      {status === "joined" && <p> You’ve successfully joined the team!</p>}
      {status === "already" && <p> You’re already a member of this team.</p>}
      {status === "error" && <p> Something went wrong. Please try again.</p>}
      {status === "notFound" && <p>Team Not Found!!!</p>}
    </div>
  );

}

