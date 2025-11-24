const User=require('../models/User');
const bcrypt=require('bcryptjs');
const generateToken=require('../utils/generateToken');
const crypto = require('node:crypto');
const transporter = require('../config/nodemailer');
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const TeamMemberShip=require("../models/TeamMembership");

//signup controller
const registerUser=async(req,res)=>{
    try{
        const {name,email,password,teamId}=req.body;
        //check user exists 
        const userExist=await User.findOne({email});
        if(userExist){
            return res.status(400).json({message:"User already exist"});
        }

         // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const tokenExpires = Date.now() + 30 * 60 * 1000; // expires in 30 minutes

        //create user
        const  user=await User.create({
          name,
          email,
          password:hashedPassword,
          verificationToken,
          tokenExpires,
        });
        //if coming from invitelink we will skip verification and auto verify here
        if (teamId) {
              user.isVerified = true;
              await user.save();
              // create membership 
              const alreadyMember = await TeamMemberShip.findOne({
                  user: user._id,
                  team: teamId,
               });

               if (!alreadyMember) {
               await TeamMemberShip.create({
               user: user._id,
               team: teamId,
               role: "member",
              });
              }
              
              return res.status(201).json({
                   success: true,
                   joinedTeam: true,
                   message: "Signup successful! You are now part of the team.",
              });
        }


        await user.save();
        await sendVerificationEmail(user, verificationToken);
        return  res.status(201).json({
           joinedTeam: false,
           message: "Signup successful! Please check your email to verify your account.",
    
        });
    }catch(err){
         console.error(err);
         return res.status(500).json({ message: "Server error", error: err.message });
    }
};

//email verification
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user){
      // Redirect to frontend failure page
      return res.redirect('http://localhost:5173/verify-failed');
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Redirect to frontend success page
    return res.redirect('http://localhost:5173/verify-success');
  } catch (err) {
    console.log(err);
    return res.redirect('http://localhost:5173/verify-failed');
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password,teamId } = req.body;
    console.log("in login controller teamId is ",teamId);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User Does not exist.Please signup" });
    if (!user.isVerified)
      return res.status(400).json({ message: "Please verify your email before logging in." });

    const isMatch = await bcrypt.compare(password,user.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user);

     let joinedTeam = false;

    // auto join team if teamId is provided
    if (teamId) {

      const alreadyMember = await TeamMemberShip.findOne({ user: user._id, team: teamId });
      if (!alreadyMember) {
        await TeamMemberShip.create({
          user: user._id,
          team: teamId,
          role: "member",
        });
        joinedTeam = true;
      }
    }
    console.log("Joined team= ",joinedTeam);

   return  res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email},
      joinedTeam, 
    });
  } catch (error) {
   return  res.status(500).json({ error: error.message });
  }
};

//resend verification email
const resendVerificationEmail=async(req,res)=>{
  try{
      const {email}=req.body;
      const user=await User.findOne({email});
      if(!user){
         return res.status(400).json({ message: "User not found. Please sign up." });
      }
      if (user.isVerified) {
        return res.status(400).json({ message: "Account already verified. Please log in." });
      }
      const newToken = crypto.randomBytes(32).toString("hex");
      const newExpiry = Date.now() + 30 * 60 * 1000; // 30 mins
      user.verificationToken = newToken;
      user.tokenExpires = newExpiry;
      await user.save();
      await sendVerificationEmail(user, newToken);
      return res.status(200).json({ message: "Verification email resent successfully!" });


  }catch(err){
    console.error(err);
    return res.status(500).json({ message: "Failed to resend email", error: err.message });
  }
}

module.exports={registerUser,loginUser,verifyEmail,resendVerificationEmail};