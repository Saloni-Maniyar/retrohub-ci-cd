
export const handleLogin = async ({ email, password }) => {
  let emailErr = "";
  let passwordErr = "";

  // email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    emailErr = "Email is required.";
  } else if (!emailRegex.test(email)) {
    emailErr = "Please enter a valid email address.";
  } else {
    emailErr = "";
  }

  // password validation
  if (!password) {
    passwordErr = "Password is required.";
  } else {
    passwordErr = "";
  }

  return { emailErr, passwordErr };
};
