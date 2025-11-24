import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export const fetchDiscussionMessages = async (teamId, feedbackId, token) => {
  const res = await axios.get(`${API_BASE}/api/discussion/${teamId}/${feedbackId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const sendDiscussionMessage = async (teamId, feedbackId, content, token) => {
  const res = await axios.post(
    `${API_BASE}/api/discussion/${teamId}/${feedbackId}`,
    { content },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
