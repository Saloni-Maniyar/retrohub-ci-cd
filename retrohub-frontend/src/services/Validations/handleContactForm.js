// contactValidation.js
export function handleContactValidation({ name, email, message }) {
  let nameErr = "";
  let emailErr = "";
  let messageErr = "";

  // Name Validation
  if (!name.trim()) {
    nameErr = "Name is required.";
  } else if (name.length < 3) {
    nameErr = "Name must be at least 3 characters long.";
  } else if (!/^[A-Za-z\s]+$/.test(name)) {
    nameErr = "Name should contain only alphabets and spaces.";
  }

  // Email Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    emailErr = "Email is required.";
  } else if (!emailRegex.test(email)) {
    emailErr = "Please enter a valid email address.";
  }

  // Message Validation
  if (!message.trim()) {
    messageErr = "Message cannot be empty.";
  } else if (message.length < 10) {
    messageErr = "Message should be at least 10 characters long.";
  }

  return { nameErr, emailErr, messageErr };
}
