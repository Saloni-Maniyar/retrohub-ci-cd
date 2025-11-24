import "../styles/AboutUs.css";
import { Users, MessageSquare, ShieldCheck, Zap } from "lucide-react";

export default function AboutUs() {
  const features = [
    {
      icon: <Users className="icon" />,
      title: "Team Collaboration",
      desc: "Managers can create teams, invite members, and organize retrospectives seamlessly.",
    },
    {
      icon: <MessageSquare className="icon" />,
      title: "Anonymous Feedback",
      desc: "Members can share honest thoughts openly or anonymously, encouraging transparency.",
    },
    {
      icon: <ShieldCheck className="icon" />,
      title: "Secure & Reliable",
      desc: "Your data is safe with role-based access and modern security practices.",
    },
    {
      icon: <Zap className="icon" />,
      title: "Discussion Boards",
      desc: "Feedback can spark structured discussions to clarify ideas and solve problems.",
    },
  ];

  return (
    <div className="about-container">
      <h1 className="about-title">About RetroHub</h1>
      <p className="about-subtitle">
        RetroHub is a modern retrospection and collaboration platform designed
        for teams, classrooms, and organizations. We make it easy for members
        to share feedback, start discussions, and grow together.
      </p>

      <div className="features-grid">
        {features.map((f, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
