// contactApi.js
import axios from "axios";

export async function submitContactApi({ name, email, message }) {
  try {
    const token = sessionStorage.getItem("token"); // optional, keep consistent

    const res = await axios.post(
      "http://localhost:5001/api/contact",
      {
        name,
        email,
        message,
      },
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    console.log("Contact form submitted:", res.data);
    return res.data;
  } catch (err) {
    console.log("Contact form error:", err.response?.data?.message || err.message);
    throw err;
  }
}
