const mongoose=require('mongoose');

const teamMembershipShema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    team:{type:mongoose.Schema.Types.ObjectId,ref:'Team'},
    role:{
        type:String,
        required:true,
        enum:["member","manager"]
    },
    joined_date:{
        type:Date,
        default:Date.now()
    }

});

module.exports=mongoose.model("TeamMemberShip",teamMembershipShema)