const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/keys');
exports.createToken = ({ userId }) => {
  console.log(userId)
  return jwt.sign({ _id: userId }, SECRET_KEY, { expiresIn: '10h' });
};

exports.validateToken = token => {
  return jwt.verify(token, SECRET_KEY);
}