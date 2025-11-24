export function handleResetPassword({ newPassword, confirmPassword }) {
  let newPasswordErr = "";
  let confirmPasswordErr = "";

  const upperCase = /[A-Z]/;
  const lowerCase = /[a-z]/;
  const number = /[0-9]/;
  const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

  // Password validation
  if (!newPassword) {
    newPasswordErr = "Password is required.";
  } else if (newPassword.length < 8) {
    newPasswordErr = "Password must be at least 8 characters long.";
  } else if (!upperCase.test(newPassword)) {
    newPasswordErr = "Password must contain at least one uppercase letter.";
  } else if (!lowerCase.test(newPassword)) {
    newPasswordErr = "Password must contain at least one lowercase letter.";
  } else if (!number.test(newPassword)) {
    newPasswordErr = "Password must contain at least one number.";
  } else if (!specialChar.test(newPassword)) {
    newPasswordErr = "Password must contain at least one special character.";
  } else {
    newPasswordErr = "";
  }

  // Confirm password validation
  if (!confirmPassword) {
    confirmPasswordErr = "Please confirm your password.";
  } else if (confirmPassword !== newPassword) {
    confirmPasswordErr = "Passwords do not match.";
  } else {
    confirmPasswordErr = "";
  }

  return { newPasswordErr, confirmPasswordErr };
}
