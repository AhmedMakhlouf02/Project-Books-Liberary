const db = require("../models");
const User = db.User;
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

// Regester User
const register = async (req, res) => {
  const { name, email, password } = req.body;

  const alreadyExistsUser = await User.findOne({ where: { email } })
  if (alreadyExistsUser) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "User with email already exists!" });
  }

  const user = await User.create({ name, email, password});
  const token = user.createJWT();

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name, email: user.email }, token });
};

// login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new BadRequestError(`Please Provide email and password`);
    }
    const user = await User.findOne({ where: { email } })

    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    // compare Password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError(`Invalid Password`);
    }
    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
  } catch (error) {
    if (
      error instanceof BadRequestError ||
      error instanceof UnauthenticatedError
    ) {
      res.status(StatusCodes.UNAUTHORIZED).json({ error: error.message });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to login" });
    }
  }
};

module.exports = {
  register,
  login,
};
