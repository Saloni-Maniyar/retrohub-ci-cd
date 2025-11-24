import axios from 'axios';
export async function joinTeam(teamId,email,token=null){
    console.log("In join team api");
    try{
         const headers = token ? { Authorization: `Bearer ${token}` }:{}; // include token only if user logged in
        
         const res = await axios.post(
                `http://localhost:5001/api/join-team`,
                 {teamId, email },
                { headers }
        );
        console.log("response from backend: join team",res);

        return res.data;
    }catch(err){
        console.error("Error in joinTeamApi:", err);
        return { success: false, message: err.response?.data?.message || "Error" };
    }
}