const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/keys');
const Admin = require('../models/admins');

exports.createToken = ({ userId }) => {
  return jwt.sign({ _id: userId }, SECRET_KEY, { expiresIn: '10h' });
};

exports.validateToken = token => {
  return jwt.verify(token, SECRET_KEY);
}

exports.isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const validToken = token ? this.validateToken(token) : {};
  return next();
  try {
    const now = Date.now().valueOf() / 1000;
    if (validToken.exp > now) {
      const admin = Admin.findById(validToken._id);
      if (admin) {
        next();
      } else {
        res.status(403).json({ success: false, error: 'You are not authorized' });
      }

    } else {
      res.status(401).json({ success: false, error: 'You are not athentiated' })
    }

  } catch (error) {
    res.status(401).json({ success: false, error: 'You are not authenticated' });
  }
}