const { validateToken } = require("../service/auth");

const isLoggedIn = (req, res, next) => {
  try {
    const authorizationHeader = req.headers["authorization"];
    req.user = null;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer")) {
      return next();
    }
    const token = authorizationHeader.split("Bearer ")[1];
    const user = validateToken(token, "S3cUreK3y!2023#Taqr33b@t");
    req.user = user;
    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).send("Internal Server Error");
  }
};

const restrictTo =
  (roles = []) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user?.role)) {
      return res.status(401).send("Unauthorized: Insufficient permissions");
    }
    next();
  };

module.exports = {
  isLoggedIn,
  restrictTo,
};
