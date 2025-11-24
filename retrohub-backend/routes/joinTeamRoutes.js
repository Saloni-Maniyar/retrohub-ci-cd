const express=require('express');
const router=express.Router();
const {joinTeam}=require('../controllers/jointeamController');
const authMiddleware=require('../middleware/authMiddleware');
//join Team
router.post('/',authMiddleware.optional,joinTeam);

module.exports=router;