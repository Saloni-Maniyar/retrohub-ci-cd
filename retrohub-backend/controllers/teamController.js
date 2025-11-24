const Team=require('../models/Team');
const TeamMemberShip=require('../models/TeamMembership');
const transporter=require('../config/nodemailer');
//Team creation route
const createTeam=async(req,res)=>{
    try{
        console.log("REQ BODY:", req.body);
        const userid=req.user.id;
        console.log('userid ',userid);
        const {team_name,description,team_type}=req.body;
        const team=await Team.create({team_name,team_type,description,created_by:userid});
        console.log(team);
        console.log(userid);
        const teamMembership=await TeamMemberShip.create({user:userid,team:team._id,role:"manager",joined_date:Date.now()})
        return  res.status(201).json({message:"team created",team,teamMembership});
    }catch(err){
       return res.status(500).json({ message: "Server error", error: err.message });
    }
    

};

//delete Team
const deleteTeam=async(req,res)=>{
    try{
        const userid=req.user.id;
        const {teamid}=req.params;
        console.log(teamid);
        console.log(userid);
        const manager=await TeamMemberShip.findOne({role:"manager",user:userid,team:teamid});
        console.log(manager);
        if(!manager){
             return res.status(403).json({ message: "You are not authorized to delete this team" });
        }
        const deletedTeam=await Team.findByIdAndDelete(teamid);
        if(!deletedTeam){
            return res.status(404).json({message:"Team not found"});
        }
        console.log('deleted team',deletedTeam);
        //after deleting team delete all the membership record related to that team
        const deletedMemberships=await TeamMemberShip.deleteMany({team:teamid});
        console.log("deleted all members from that team",deletedMemberships);
         return res.status(200).json({
                message: "Team and related memberships deleted successfully",
                deletedTeam,
                deletedMemberships
    });
        
    }catch(err){
        return res.status(500).json({ message: "Server error", error: err.message });
    }
    
}

//fetch Teams
const fetchTeams=async(req,res)=>{
    try{
        const userid=req.user.id;
        const memberships=await TeamMemberShip.find({user:userid}).populate('team');

        console.log('memberships',memberships);
        const managedTeams=[];
        const participatedTeams=[];

        for(const membership of memberships){
            const team=membership.team;
            if(!team) continue;
            // count total members (including manager)
            const memberCount = await TeamMemberShip.countDocuments({ team: team._id });

            // attach members_count to team
            const teamWithCount = {
                 ...team.toObject(),
                 members_count: memberCount,
            };
            if (membership.role === 'manager') {
                 managedTeams.push(teamWithCount);
            } else {
                 participatedTeams.push(teamWithCount);
            }
        }
        console.log('managed Teams: ',managedTeams);
        console.log('Participated Teams: ',participatedTeams);

       return res.status(200).json({
             message: "Fetched teams successfully",
             managedTeams,
             participatedTeams,
        });
        
    
    
    }catch(err){
        return  res.status(500).json({ message: "Server error", error: err.message });
    }
}

//send Invites 
const sendInvites=async(req,res)=>{
    console.log("In sendinvites");

    try{
        const {teamid}=req.params;
        console.log("teamid",teamid);
        const {emails}=req.body;
        console.log("emails",emails);
        const team=await Team.findById(teamid);
        console.log("team name",team.team_name);
        if (!emails || !emails.length) {
        return res.status(400).json({ message: "No emails provided" });
        }
        for (let email of emails) {
            console.log("in for loop");
             const inviteLink = `http://localhost:5173/join-team/${teamid}?email=${email}`;
             await transporter.sendMail({
             from: process.env.EMAIL_USER,
             to: email,
             subject: "Team Invitation",
             html: `<p>You are invited to join the team ${team.team_name}!</p>
               <p><a href="${inviteLink}">Click here to join</a></p>`,
            });
            console.log("sent a mail");
        }
        console.log("sent all mails");
         return res.json({ message: "Invitations sent successfully"});
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Error sending invites" });
    }
}

module.exports={createTeam,deleteTeam,fetchTeams,sendInvites};
