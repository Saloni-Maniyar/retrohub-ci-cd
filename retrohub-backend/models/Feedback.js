const mongoose=require('mongoose');

const feedbackSchema=new mongoose.Schema({
    team:{type:mongoose.Schema.Types.ObjectId,ref:'Team'},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    type: {
         type: String,
         enum: ["positive", "negative", "improvement"],
         required: true,
    },
    message:{
        type:String,
        required:true,
    },
    anonymous:{
        type:Boolean,
        default:false,
    },


});

module.exports=mongoose.model("Feedback",feedbackSchema)