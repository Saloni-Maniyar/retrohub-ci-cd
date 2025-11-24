const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },  // only id & email in payload
    process.env.JWT_SECRET,
    { expiresIn: "1h" }                   // token expires in 1 hour
  );
};

module.exports = generateToken;