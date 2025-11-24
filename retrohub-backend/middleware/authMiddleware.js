require('dotenv').config();
const jwt=require('jsonwebtoken');

const required=(req,res,next)=>{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
             return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1]; // extract token after "Bearer"

         jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
             return res.status(403).json({ message: "Invalid or expired token" });
        }

        req.user = decoded; // decoded = { id, role, iat, exp }
        next(); // go to the next handler
  });
}


//  Optional authentication — used for routes like join-team
// Doesn’t block if token missing or invalid; just skips.
const optional = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // attach user info if token valid
    } catch (err) {
      // ignore invalid or expired token — no need to block
    }
  }
  next();
};

module.exports=required;
module.exports.optional=optional;