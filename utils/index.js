const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/keys');
const Admin = require('../models/admins');

exports.createToken = ({ userId }) => {
  return jwt.sign({ _id: userId }, SECRET_KEY, { expiresIn: '10h' });
};

exports.validateToken = token => {
  try {
    return jwt.verify(token, SECRET_KEY);
  }
  catch (err) {
    return {};
  }

}

exports.currentUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const validToken = token ? this.validateToken(token) : {};

  try {
    const user = await Admin.findById(validToken._id);
    if (user) {
      req.locals = { ...req.locals, _id: user._id };
      next();
    } else {
      res.status(403).json({ success: false, error: 'You are not authorized' });
    }

  } catch (error) {
    console.log(error)
    res.status(401).json({ success: false, error: 'You are not authenticated' });
  }
}
exports.isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  console.log(this.validateToken(token));
  const validToken = token ? this.validateToken(token) : {};
  try {
    const admin = await Admin.findById(validToken._id);
    if (admin) {
      req.locals = { ...req.locals, _id: admin._id, role: 'admin' };
      next();
    } else {
      res.status(403).json({ success: false, error: 'You are not authorized' });
    }

  } catch (error) {
    console.log(error)
    res.status(401).json({ success: false, error: 'You are not authenticated' });
  }
}