require("dotenv").config();
const { verifyToken } = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
module.exports = authMiddleware;
