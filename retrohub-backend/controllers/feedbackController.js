
const Feedback=require('../models/Feedback');
const TeamMembership=require('../models/TeamMembership');
const {io}=require('../server');
const fetchFeedback=async(req, res)=>{
    try{
        const { teamId} = req.params;

        //Find out user role 
        const membership = await TeamMembership.findOne({
            user: req.user.id,
            team: teamId,
        });

        const role = membership ? membership.role : "member";
        console.log("user is ",role," of team");
        const feedbacks=await Feedback.find({team:teamId}).populate('user', 'name');
        console.log("feedbacks",feedbacks);
        return res.status(200).json({feedbacks,role});

    }catch(err){
        return res.status(500).json({ message: err.message });
    }
    



};

const addFeedback=async(req,res)=>{
    try{
        const { teamId, type, message, anonymous } = req.body;
        console.log("req.user:", req.user);
        console.log("teamId:", teamId);
        console.log("type:", type);
        console.log("message:", message);

      
        const feedback=new Feedback({
            team:teamId,
            user:req.user.id,
            type,
            message,
            anonymous:!!anonymous
        });
        await feedback.save();
        await feedback.populate('user', 'name');

        // Emit via socket for real-time updates
         if (io) {
                 io.emit("feedbackAdded", feedback);
        } else {
                 console.warn("Socket.io not initialized, skipping emit");
         }
        console.log("feedback sent:",feedback);
        return res.status(201).json({message:"feedback sent",feedback});
    }catch(err){
         return res.status(500).json({ message: err.message });
    }
};

module.exports={fetchFeedback,addFeedback};