import axios from 'axios'
export  async function SignupApi({name,email,password,teamId}){
    console.log("In SignupApi function");
    try{
        const res=await axios.post("http://localhost:5001/api/auth/signup",{
            name:name,
            email:email,
            password:password,
            teamId:teamId,
        });
        console.log("post request done , signup data",res.data);
        return res.data;
    }catch(err){
        console.error("Error signing up:", err.response?.data?.message || err.message);
        throw err;
    }
       
        
}