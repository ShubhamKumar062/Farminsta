const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ success: false, error: 'User not found. Access denied.' });
      }
      req.user = user;
      next();
    } catch (error) {
      
      next(error);
    }
  } else {
    return res.status(401).json({ success: false, error: 'Not authorized. Token is missing.' });
  }
};
module.exports = { protect };
