import jwt from 'jsonwebtoken';

/**
 * Authentication middleware
 * Verifies JWT token and adds user data to request
 */
const auth = (req, res, next) => {
  try {
    // Check for token in cookies first
    let token = req.cookies?.token;
    
    // If not in cookies, check Authorization header
    if (!token) {
      const authHeader = req.header('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
      }
      token = authHeader.split(' ')[1];
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user data to request with consistent ID field
    req.user = {
      id: decoded.id || decoded._id || decoded.uid,
      ...decoded
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired.' });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export default auth; 