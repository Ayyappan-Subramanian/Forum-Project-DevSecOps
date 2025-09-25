// middleware/auth.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expect "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  try {
    const verified = jwt.verify(token, 'mysecretkey'); // use process.env.SECRET_KEY in production

    // jwt.verify() is a method from the jsonwebtoken library. If the token is valid, it returns the decoded payload

    req.user = verified; // attach user info to request
    //req is the request object that all Express routes receive. By doing this, any route after this middleware can access the logged-in user info:
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;