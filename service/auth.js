const jwt = require("jsonwebtoken");

const setUser = (user, secret) => {
  const payload = {
    _id: user._id,
    email: user.name,
    role: user.role,
  };
  return jwt.sign(payload, secret, { expiresIn: "1h" });
};

const validateToken = (token, secret) => {
  if (!token) return null;
  return jwt.verify(token, secret);
};

module.exports = {
  setUser,
  validateToken,
};
