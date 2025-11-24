const express=require('express');
const {registerUser,loginUser,verifyEmail,resendVerificationEmail}=require('../controllers/authController');
const router=express.Router();

router.post('/signup',registerUser);
router.post('/login',loginUser)
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification',resendVerificationEmail);
module.exports=router;