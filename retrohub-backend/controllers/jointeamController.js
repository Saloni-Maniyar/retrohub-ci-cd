const express=require('express');
const router=express.Router();
const User=require('../models/User');
const Team=require('../models/Team');
const TeamMemberShip=require('../models/TeamMembership');
// const authMiddleware=require('../middleware/authMiddleware')

//post join-team
const joinTeam=async(req,res)=>{
    console.log("in join team controller ");
    const {teamId,email}=req.body;
    console.log("teamid=",teamId,"email=",email);
    if (!teamId || !email) {
            console.log("team id and email does not exist");
             return res.status(400).json({ success: false, message: "Missing teamId or email" });
    }  
    try{
        const team = await Team.findById(teamId);
        console.log("team= ",team);
        if (!team) {
            console.log('team not found');
             return res.status(404).json({ success: false, message: "Team not found" });
        }
        const user=await User.findOne({email});
        console.log("user to be join: ",user);
         if (!user) {
             return res.json({
                    success: false,
                    userNotFound: true,
                    message: "User not found. Please sign up to join the team.",
            });
         }

          const existingMembership = await TeamMemberShip.findOne({ user: user._id, team: teamId });
          if (existingMembership) {
                 const isLoggedIn = req.user && req.user.email === email;
                 return res.json({ 
                    success: false, 
                    alreadyMember: true, 
                    message: "Already a team member.",
                    isLoggedIn,
                 });
          }
          //loggedin user 
           if (req.user && req.user.email === email) {
                
                await TeamMemberShip.create({
                    user: user._id,
                    team: teamId,
                    role: "member",
                    joined_date: Date.now(),
                 });
                return res.json({ success: true, joinedNow: true, teamName: team.team_name });
             }

       //exists but not logged in
         return res.json({ success: false, needLogin: true, message: "Please log in to join." });
       
        
    }catch(err){
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }  
};

module.exports={joinTeam};