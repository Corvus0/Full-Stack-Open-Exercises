const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");

const errorHandler = (error, req, res, next) => {
  const message = error.message;
  console.error(message);

  if (error.name === "TypeError" || error.name === "SequelizeValidationError") {
    return res.status(400).send({ error: message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).send({ error: "Token invalid" });
  }

  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = { errorHandler, tokenExtractor };
