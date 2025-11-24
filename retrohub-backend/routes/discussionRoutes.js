const express=require('express');
const router=express.Router();
const {addMessage,getMessagesByFeedback}=require('../controllers/discussionController');
const authMiddleware=require('../middleware/authMiddleware');

router.get("/:teamId/:feedbackId", authMiddleware, getMessagesByFeedback);

// POST → add a message to feedback’s discussion
router.post("/:teamId/:feedbackId", authMiddleware, addMessage);
module.exports=router;