const express=require('express');
const router=express.Router();
const {fetchFeedback,addFeedback}=require("../controllers/feedbackController");
const authMiddleware=require('../middleware/authMiddleware');

router.post("/",authMiddleware,addFeedback);
router.get("/:teamId",authMiddleware,fetchFeedback);

module.exports=router;