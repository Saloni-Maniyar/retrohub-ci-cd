import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// Fetch all feedback for a team
export const fetchFeedback = async (teamId, token) => {
  try {
    console.log("Token used for fetching feedback:", token);

    const res = await axios.get(`${API_URL}/api/feedback/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching feedback:", error.response?.data || error.message);
    throw error; // rethrow so calling code can handle it
  }
};

// Add a new feedback
export const addFeedback = async (feedbackData, token) => {
  try {
    const res = await axios.post(`${API_URL}/api/feedback/`, feedbackData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding feedback:", error.response?.data || error.message);
    throw error; // rethrow so calling code can handle it
  }
};
