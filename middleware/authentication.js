const db = require('../models');
const User = db.User;
const jwt = require("jsonwebtoken");
const { Unauthenticated } = require("../errors/unauthenticated");
const UnauthenticatedError = require("../errors/unauthenticated");

const auth = async (req, res, next) => {
  // Check Header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError(`Authentication invalid`);
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the routes

    const user = await User.findByPk(payload.id, {
      attributes: { exclude: ["password"] },
    });

    req.user = user;
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError(`Authentication invalid`);
  }
};


module.exports = auth;
