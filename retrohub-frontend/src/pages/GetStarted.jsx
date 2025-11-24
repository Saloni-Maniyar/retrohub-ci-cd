import '../styles/GetStarted.css';
import createTeam from '../assets/CreateTeamNew.png';
import MyTeam from '../assets/myteamNew.png';
// import {useNavigate} from react-router-dom;
// import { useEffect } from 'react';
import {Link} from 'react-router-dom';
// import {useState} from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function GetStarted(){
   
    const {isLoggedIn}=useContext(AuthContext);
    return(
        <div className="GetStarted">
            
            <h1>Welcome to Retrohub</h1>
            {isLoggedIn? 
            <div className="afterLogin">
                <div className="card">
                        <img src={createTeam} alt="Create Team Image" />
                        <div className="description">
                           <ul>
                                {/* <p>Create Team: </p> */}
                                <li>for your organization</li>
                                <li>for your college students</li>
                                <li>for your personal groups </li>
                           </ul>
                        </div>
                        <Link to="/create-team"><button>Create Teams</button></Link>

                </div>
                <div className="card">
                     <img src={MyTeam} alt="Create Team Image" id='myteamimg'/>
                        <div className="description">
                           <ul>
                                {/* <p>My Team: </p> */}
                                <li>Explore Teams you are part of</li>
                                <li>Express with retroboards</li>
                                <li>Take part in discussions</li>
                           </ul>
                        </div>
                        <Link to="/teams"><button>My Teams</button></Link>
                </div>
            </div> :
            <>

                 <h4 style={{color:'white'}}>Let's Grow together</h4>
                 <a href='/Login'><button>Login</button></a>
                 <a href='/Signup'><button>Signup</button></a> 
            </>}
           
            
        </div>
    );
}