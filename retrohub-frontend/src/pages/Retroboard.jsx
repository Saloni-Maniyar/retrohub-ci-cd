import { useNavigate, useParams } from "react-router-dom";
import "../styles/Retroboard.css";
import { MessageSquare } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { fetchFeedback, addFeedback } from "../services/ApiHandlers/feedbackApi";
import { AuthContext } from "../context/AuthContext";
import { io } from "socket.io-client";

export default function Retroboard() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { token , user} = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [socket, setSocket] = useState(null);
  const [role, setRole] = useState("member");

  {console.log("token in retrohub:",token);}
  {console.log("user from authcontext: ",user);}
  // fetch feedbacks on mount
  useEffect(() => {
    if (!token) return;
    const loadFeedbacks = async () => {
      try {
        const data = await fetchFeedback(teamId, token);
        setFeedbacks(data.feedbacks || []);
        setRole(data.role);
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
      }
    };
    loadFeedbacks();
  }, [teamId, token]);

  // connect to socket.io
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("feedbackAdded", (newFeedback) => {
      setFeedbacks((prev) => {
        if (prev.some((f) => f._id === newFeedback._id)) {
          return prev; // already exists
        }
        return [...prev, newFeedback];
      });
    });

    return () => newSocket.disconnect();
  }, [teamId]);

  // handle new feedback addition
  const handleAddFeedback = async (type) => {
    const message = prompt(`Enter your feedback for "${type}"`);
    if (!message) return;

    const isAnonymous = window.confirm("Do you want to post this anonymously?");

    const feedbackData = {
      teamId,
      type:
        type === "good"
          ? "positive"
          : type === "bad"
          ? "negative"
          : "improvement",
      message,
      anonymous: isAnonymous,
    };

    try {
      const res = await addFeedback(feedbackData, token);
      const newFeedback = res.feedback;
      // setFeedbacks((prev) => [...prev, newFeedback]);
      if (socket) socket.emit("feedbackAdded", newFeedback);
    } catch (err) {
      console.error("Error adding feedback:", err);
    }
  };

  const handleDiscussionClick = (feedbackId) => {
    navigate(`/teams/${teamId}/discussion/${feedbackId}`);
  };
  

  //display name 
  const displayName = (f) => {
    console.log("display name = ",f , "and ", user);
    
    if (f.user?._id === user?.id) {
      return "Me"; // always "Me" for your own feedbacks
    }
    if (role === "manager") return f.user?.name || "User";

    

    return f.anonymous ? "Anonymous" : f.user?.name || "User";
  };

  // helper to render feedbacks by type
  const renderFeedbacks = (type) => {
    const typeMap = { good: "positive", bad: "negative", improve: "improvement" };
    const filtered = feedbacks.filter((f) => f.type === typeMap[type]);
    if (filtered.length === 0)
      return <p className="no-feedback">No feedbacks yet.</p>;

    return filtered.map((f) => (
      <div className="response-card" key={f._id}>
        <p className="feedback-text">{f.message}</p>
        <small className="feedback-user">
         {displayName(f)}
        </small>
        <MessageSquare
          className="discussion-icon"
          onClick={() => handleDiscussionClick(f._id)}
          title="Go to Discussion"
        />
      </div>
    ));
  };

  return (
    <div className="retroboard">
      <h2 className="retroboard-title">Retroboard </h2>
      <div className="retroboard-columns">
        {/* Column 1: What is Good */}
        <div className="retro-column">
          <h3 className="column-title">What is Good</h3>
          <button className="add-btn" onClick={() => handleAddFeedback("good")}>
            + Add
          </button>
          {renderFeedbacks("good")}
        </div>

        {/* Column 2: What is Bad */}
        <div className="retro-column">
          <h3 className="column-title">What is Bad</h3>
          <button className="add-btn" onClick={() => handleAddFeedback("bad")}>
            + Add
          </button>
          {renderFeedbacks("bad")}
        </div>

        {/* Column 3: What to Improve */}
        <div className="retro-column">
          <h3 className="column-title">What to Improve</h3>
          <button
            className="add-btn"
            onClick={() => handleAddFeedback("improve")}
          >
            + Add
          </button>
          {renderFeedbacks("improve")}
        </div>
      </div>
    </div>
  );
}
