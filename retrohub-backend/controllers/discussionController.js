const Message=require('../models/Message');
const Feedback=require('../models/Feedback');

// Get all messages for a feedback
const getMessagesByFeedback = async (req, res) => {
  try {
    const { teamId, feedbackId } = req.params;

    // Optional: verify feedback belongs to this team
    const feedback = await Feedback.findById(feedbackId)
      .populate("user", "name email")
      .lean();

    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    const messages = await Message.find({ feedbackId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    res.json({
      feedbackMessage: feedback.message,
      messages,
    });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new message to a feedback’s discussion
 const addMessage = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) return res.status(400).json({ message: "Message content required" });

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    const message = new Message({
      feedbackId,
      sender: userId,
      content,
    });

    await message.save();
    await message.populate("sender", "name email");

    res.status(201).json({ message });
  } catch (err) {
    console.error("Error adding message:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports={addMessage,getMessagesByFeedback};