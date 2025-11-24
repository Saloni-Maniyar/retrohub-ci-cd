import {useState} from 'react'
import { validateTeam } from '../services/Validations/handleTeamCreation'; 
import { useNavigate } from 'react-router-dom';
import { createTeamApi } from '../services/ApiHandlers/createTeamApi';
import "../styles/Team.css";
export default function Team(){
    const [teamName,setTeamName]=useState('');
    const [description,setDescription]=useState('');
    const [selectedValue,setSelectedValue]=useState('');
    const [creationSuccessMessage,setCreationSuccessMessage]=useState('');
    const [creationError,setCreationError]=useState('');
    const [selectionError,setSelectionError]=useState('');
    const [teamNameError,setTeamNameError]=useState('');
    const navigate=useNavigate();

    const handleSubmint=async (e)=>{
        e.preventDefault();
        const {teamNameError,selectionError}=validateTeam({teamName,selectedValue});
        setTeamNameError(teamNameError);
        setSelectionError(selectionError);
        if(!teamNameError && !selectionError){
            try{
                     const data=await createTeamApi({teamName,description,selectedValue});
                     console.log(data);
                     setCreationError("");
                     setCreationSuccessMessage("Team Created Successfully");
                     setDescription('');
                     setTeamName('');
                     setDescription('');
                     setSelectedValue('');
                       setTimeout(() => {
                         navigate("/teams");
                       }, 2000);
                    
                
            }catch(err){
                setCreationError(err.response?.data?.message || "Team Creation failed");
                setCreationSuccessMessage('');
            }
        }

    };
    

    return(
        <div className="Team">
                <div className="CreationMessage">
                         {console.log("success message",{creationSuccessMessage})}
                         {console.log("creation error",{creationError})}
                         {creationSuccessMessage && <p className="creationSuccessMessage">{creationSuccessMessage}</p>}
                         {creationError && <p className="creationError">{creationError}</p>}
                </div> 
                <div className="team-creation-card">
                    <h2>Create Team Here..</h2>
                    <form onSubmit={handleSubmint}>
                            <input type='text' value={teamName}
                                 placeholder='Enter Team Name'
                                 onChange={(e) => setTeamName(e.target.value)}
                                 required
                            />
                            {teamNameError && <p className="error">{teamNameError}</p>}  

                            <textarea placeholder="Describe here" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                            
                            <select
                                value={selectedValue}
                                onChange={(e) => setSelectedValue(e.target.value)}
                                required
                            >
                                 <option value="">-- Select Team Category --</option>
                                 <option value="personal">Personal</option>
                                 <option value="organization">Organization</option>
                                 <option value="college">College</option>
                             </select>
                             {selectionError && <p className="error">{selectionError}</p>}

                            <button type="submit">Create Team</button>

                    </form>
                </div>
        </div>
    );
}
