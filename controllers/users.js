const User = require("../models/users");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  Types: { ObjectId },
} = require("mongoose");

async function registerUser(req, res) {
  try {
    const {
      body: { password },
    } = req;
    const hash = await bcrypt.hash(password, 10);
    newUser = await User.create({ ...req.body, password: hash });
    res.status(201).send({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    console.log(error.message);
    if (error.keyValue.email) res.status(409).send("Email in use");
    res.status(500).send(error.message);
  }
}

function validateDataOfUser(req, res, next) {
  const validationRules = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    res.status(400).send(validationResult.error.details[0].message);
  }

  next();
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).send("Email or password is wrong");
  }
  const result = await bcrypt.compare(password, user.password);

  if (!result) {
    return res.status(401).send("Email or password is wrong");
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  const userWithToken = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );
  res.status(200).send({
    token: token,
    user: { email, subscription: user.subscription },
  });
}

async function logOut(req, res) {
  const userId = req.user._id;

  const userwithoutToken = await User.findByIdAndUpdate(
    userId,
    { token: "" },
    { new: true }
  );
  const authorizationHeader = req.get("Authorization");
  const authorizationHeaderEmpty = authorizationHeader.replace(
    authorizationHeader,
    ""
  );
  res.status(204).send("null");
}

async function tokenChecking(req, res, next) {
  const authorizationHeader = req.get("Authorization");
  if (!authorizationHeader) {
    return res.status(401).send("Not authorized");
  }
  const token = authorizationHeader.replace("Bearer ", "");
  try {
    const { userId } = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId);
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).send("Not authorized");
  }
}

async function listUsers(req, res) {
  try {
    const listOfUsers = await User.find();
    res.status(200).send(listOfUsers);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

async function getUserById(req, res) {
  try {
    const {
      params: { userId },
    } = req;
    foundUser = await User.findById(userId);
    foundUser
      ? res.status(200).send(foundUser)
      : res.status(404).send({ message: "User not found" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
}

async function removeUser(req, res) {
  try {
    const {
      params: { userId },
    } = req;
    deletedUser = await User.findByIdAndDelete(userId);
    deletedUser
      ? res.status(200).send({ message: "User deleted" })
      : res.status(404).send({ message: "User not found" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
}

async function updateUser(req, res) {
  try {
    const {
      params: { userId },
    } = req;
    const subscription = req.body.subscription;
    if (
      subscription === "pro" ||
      subscription === "premium" ||
      subscription === "free" ||
      subscription === undefined
    ) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: req.body },
        {
          new: true,
        }
      );
    } else {
      res.status(400).send({
        message:
          "Field subscrcription should be one of following : 'free', 'pro', 'premium'",
      });
    }
    updatedUser
      ? res.status(200).send(updatedUser)
      : res.status(404).send({ message: "User not found" });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
}

function validateUpdateUser(req, res, next) {
  const validationRules = Joi.object({
    email: Joi.string(),
    password: Joi.string(),
    subscription: Joi.string(),
  });
  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }
  next();
}

function validateId(req, res, next) {
  const {
    params: { userId },
  } = req;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).send("User id is not valid");
  }

  next();
}

function getCurrentUserData(req, res) {
  try {
    const { email, subscription } = req.user;
    res.status(200).send({ email, subscription });
  } catch (error) {
    res.status(500).send(error);
  }
}

module.exports = {
  validateDataOfUser,
  registerUser,
  login,
  logOut,
  tokenChecking,
  listUsers,
  getUserById,
  removeUser,
  updateUser,
  validateUpdateUser,
  validateId,
  getCurrentUserData,
};
