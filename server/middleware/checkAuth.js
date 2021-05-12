const jwt = require("jsonwebtoken");

const checkAuth = async (req, res, next) => {
  const token = req.get("auth-token");

  if (!token)
    return res.status(401).json({ error: "Access denied, please login" });

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = payload.user;
    next();
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        return res.status(401).json({ error: "Timed out, please login again" });

      case "JsonWebTokenError":
        return res.status(401).json({ error: "Access denied, invalid token" });

      default:
        return res.status(500).json({ erro: "Intrenal server error" });
    }
  }
};

module.exports = checkAuth;
