const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Token is missing." });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);

    if (!decodedToken._id) {
      return res.status(400).json({ message: "Invalid token: missing user ID." });
    }

    req.jwtId = decodedToken._id;
    req.user = decodedToken;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token has expired." });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Invalid token." });
    } else {
      return res.status(500).json({ message: "Server error.", error: error.message });
    }
  }
};

module.exports = verifyJwt;
