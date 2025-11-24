import { useState } from "react";
import "../styles/ContactUs.css";
import { Mail, Phone, MapPin } from "lucide-react";
import { handleContactValidation } from "../services/Validations/handleContactForm";
import { submitContactApi } from "../services/ApiHandlers/contactApi";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    nameErr: "",
    emailErr: "",
    messageErr: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const { name, email, message } = formData;

    const { nameErr, emailErr, messageErr } = handleContactValidation({
      name,
      email,
      message,
    });

    setErrors({ nameErr, emailErr, messageErr });

    if (nameErr || emailErr || messageErr) return;

    try {
      const response = await submitContactApi({ name, email, message });
      console.log("Contact Response:", response);

      // Reset form after submit
      setFormData({ name: "", email: "", message: "" });
      setErrors({ nameErr: "", emailErr: "", messageErr: "" });
      alert("Message Sent Successfully!");
    } catch (err) {
      console.log("Contact Error:", err);
      alert("Something went wrong!");
    }
  }

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-subtitle">
        Have questions or suggestions? We’d love to hear from you.
      </p>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="info-item">
            <Mail className="icon" />
            <span>support@retrohub.com</span>
          </div>
          <div className="info-item">
            <Phone className="icon" />
            <span>+91 9359662678</span>
          </div>
          <div className="info-item">
            <MapPin className="icon" />
            <span>Pune, India</span>
          </div>
        </div>

        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.nameErr && <p className="error-text">{errors.nameErr}</p>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.emailErr && (
              <p className="error-text">{errors.emailErr}</p>
            )}
          </div>

          {/* Message */}
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows="4"
              placeholder="Write your message..."
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
            ></textarea>
            {errors.messageErr && (
              <p className="error-text">{errors.messageErr}</p>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
