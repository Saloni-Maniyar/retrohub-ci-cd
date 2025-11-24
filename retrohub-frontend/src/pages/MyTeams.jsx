// src/pages/MyTeams.jsx
import { useEffect,useState } from "react";
import TeamCard from "../components/TeamCard";
import {useNavigate} from "react-router-dom";

import "../styles/MyTeams.css";
import { fetchTeam } from "../services/ApiHandlers/fetchTeam";
export default function MyTeams() {
  const [managedTeams,setManagedTeams]=useState([]);
  const [participatedTeams, setParticipatedTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();
  
  useEffect(() => {
  const loadTeams=async ()=>{
    try{
       setLoading(true);
       const res=await fetchTeam();
       console.log("fetched data :",res);
       setManagedTeams(res.managedTeams);
       console.log("Managed Teams are: ",managedTeams);
       setParticipatedTeams(res.participatedTeams);
       console.log("Participated Teams are : ", participatedTeams);
    }catch(err){
      console.log("Error :",err);
      throw err;
    }finally{
      setLoading(false);
    }
   
  };
  loadTeams();
  


},[]);


  return (
    <div className="my-teams-page">
      {/* Managed Teams Section */}
      <section className="teams-section">
        <h2 className="section-title">Teams Managed by Me</h2>
        <div className="teams-list">
          {loading?(
            <p>Loading Teams ...</p>
          ):managedTeams.length > 0 ? (
            managedTeams.map((tm, idx) => (
            
            <TeamCard key={idx} team={tm} isManager={true}  />
            
          ))
          ):(
            <div className="no-teams">
              <p>No teams found.</p>
              <button onClick={() => navigate("/create-team")}>
                Create a Team
              </button>
            </div>
          )
          }
          
        </div>
      </section>

      {/* Participated Teams Section */}
      <section className="teams-section">
        <h2 className="section-title">Teams I’m a Member Of</h2>
        <div className="teams-list">
           {loading ? (
            <p>Loading teams...</p>
          ) : participatedTeams.length > 0 ? (
            participatedTeams.map((team, idx) => (
              <TeamCard key={idx} team={team} isManager={false} />
            ))
          ) : (
            <p>No teams found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
