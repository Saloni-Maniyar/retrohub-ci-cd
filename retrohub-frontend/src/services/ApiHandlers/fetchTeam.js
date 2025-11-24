import axios from 'axios'
export async function fetchTeam(){
    console.log("in fetch team:");
    try{
        const token = sessionStorage.getItem("token");
        console.log(token);
        const res=await axios.get("http://localhost:5001/api/team",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        
       
        );

    console.log("res",res);
    console.log("res.data",res.data);
    const {managedTeams,participatedTeams}=res.data;
    return {managedTeams,participatedTeams};
    
    }catch(err){
          console.log(err);
          console.log("Error Fetching team",err.response?.data?.message || err.message);
          throw(err);
    }
}
