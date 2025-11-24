import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import "../styles/Discussion.css";
import { AuthContext } from "../context/AuthContext";
import { fetchDiscussionMessages, sendDiscussionMessage } from "../services/ApiHandlers/discussionApi";
import { SendHorizonal } from "lucide-react";

export default function Discussion() {
  const { teamId, discussionId } = useParams();
  const { token, user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // fetch discussion messages
  useEffect(() => {
    const loadDiscussion = async () => {
      try {
        const data = await fetchDiscussionMessages(teamId, discussionId, token);
        setFeedbackMessage(data.feedbackMessage || "Discussion Thread");
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Error loading discussion:", err);
      }
    };
    if (token) loadDiscussion();
  }, [teamId, discussionId, token]);

  // socket setup
  useEffect(() => {
    if (!token) return;

    const newSocket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.emit("joinDiscussion", discussionId);

    newSocket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => newSocket.disconnect();
  }, [discussionId, token]);

  // handle send message
  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const res = await sendDiscussionMessage(teamId, discussionId, input.trim(), token);
      setInput("");
      if (socket) socket.emit("newMessage", res.message);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="discussion-container">
      <h2 className="discussion-title">Discussion</h2>
      <div className="feedback-topic">
        <p>{feedbackMessage}</p>
      </div>

      <div className="messages-box">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet. Start the discussion!</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.sender?._id === user?.id ? "me" : "other"}`}
            >
              <span className="message-sender">
                {msg.sender?._id === user?.id ? "Me" : msg.sender?.name || "User"}
              </span>
              <p className="message-content">{msg.content}</p>
            </div>
          ))
        )}
      </div>

      <div className="message-input-box">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="send-btn" onClick={handleSend}>
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
}
