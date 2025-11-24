const express=require('express');
const router=express.Router();
const {createTeam,deleteTeam,fetchTeams,sendInvites}=require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/',authMiddleware,createTeam);
router.delete('/:teamid',authMiddleware,deleteTeam);
router.get('/',authMiddleware,fetchTeams);
router.post('/:teamid/invite',authMiddleware,sendInvites)





module.exports=router;