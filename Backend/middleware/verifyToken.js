import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Check for token in Authorization header
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    // Fall back to cookie if no Authorization header
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach entire user object to request
    next(); // Move to next middleware/controller
  } catch (error) {
    console.error("Error in verifyToken:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token",
    });
  }
};
