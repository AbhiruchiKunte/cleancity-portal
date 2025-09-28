import dotenv from 'dotenv';
dotenv.config();

/**
 * Simple middleware to check for ADMIN_TOKEN in the Authorization header. (Module B6)
 */
const authenticateAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  const adminToken = process.env.ADMIN_TOKEN;

  if (!token || token !== `Bearer ${adminToken}`) {
    return res.status(401).json({ message: 'Access Denied: Invalid or missing admin token.' });
  }
  next(); // Token is valid, proceed to the next handler
};

export { authenticateAdmin };
