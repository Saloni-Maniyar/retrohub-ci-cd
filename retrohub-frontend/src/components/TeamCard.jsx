
import "../styles/TeamCard.css";
import { useNavigate } from "react-router-dom";
import {useState} from 'react';
import PropTypes from "prop-types";
import {UsersRound,UserRoundPlus,MoveUpRight} from "lucide-react";
import AddMembersModal from "../pages/AddMembersModal";
export default function TeamCard({ team,isManager }) {

const [showModal,setShowModal]=useState(false);
const teamId=team._id;
const navigate=useNavigate();
  return (
    
      <div className="team-card">
        <h3 className="team-name">{team.team_name}</h3>
        <div className="team-type">
           <p>{team.team_type}</p>
        </div>
        <p className="team-description">{team.description}</p>
        <div className="team-members">
             
           <span><UsersRound className="icon"/></span>  <span className="team-member-text"> {team.members_count} Members</span>
        </div>
       <div className="buttons">
            <button  onClick={() => navigate(`/teams/${teamId}/retroboard`)}><span>Boards</span> <MoveUpRight className="icon" /> </button>
           {isManager && (<button onClick={()=>setShowModal(true)}><span>Add members</span> <UserRoundPlus className="icon" /></button>)} 
       </div>
         {showModal && (
          <>
             <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
             <AddMembersModal teamId={teamId} onClose={() => setShowModal(false)} />
          </>
       
        )}
      </div>
      
    
  );
}
TeamCard.propTypes = {
  team: PropTypes.shape({
    teamId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    team_name: PropTypes.string.isRequired,
    description: PropTypes.string,
    team_type: PropTypes.string,
    members_count: PropTypes.number
  }).isRequired ,
   isManager: PropTypes.bool,
}; 