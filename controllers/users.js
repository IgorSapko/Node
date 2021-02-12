const User = require("../models/users");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const AvatarGenerator = require("avatar-generator");
const { uuid } = require("uuidv4");
const sgMail = require("@sendgrid/mail");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

const {
  Types: { ObjectId },
} = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT;
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

async function registerUser(req, res) {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const verificationToken = uuid();
    const newUser = await User.create({
      ...req.body,
      password: hash,
      avatarURL: "",
      verificationToken,
    });
    avatarCreate(email);
    let avatarURL = `http://localhost:${PORT}/images/${email}.png`;
    const newUserWithAvatarUrl = await User.findByIdAndUpdate(
      { _id: newUser._id },
      { $set: { avatarURL: avatarURL } },
      { new: true }
    );
    const msg = {
      to: `${email}`,
      from: process.env.verifiedSendersEmail,
      subject: "Please confirm Your email",
      text: "and easy to do anywhere, even with Node.js",
      html: `<strong>To verify Your email please go by link :</strong> <a href='http://localhost:${PORT}/auth/verify/${verificationToken}'> Click Me!</a> `,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
    res.status(201).send({
      user: { email: newUser.email, subscription: newUser.subscription },
    });
  } catch (error) {
    console.log(error);
    if (error.keyValue !== undefined && error.keyValue.email) {
      res.status(409).send("Email in use");
      return;
    }
    res.status(500).send(error.message);
  }
}

async function avatarCreate(email) {
  const avatar = new AvatarGenerator({
    imageExtension: ".png",
  });
  email.length % 2 === 0 ? (variant = "male") : (variant = "female");
  const image = await avatar.generate(email, variant);
  const avatarAddressInTmpFolder = `${path.join(
    __dirname,
    `../tmp/${email}.png`
  )}`;
  await image.png().toFile(avatarAddressInTmpFolder);
  fs.copyFileSync(
    avatarAddressInTmpFolder,
    `${path.join(__dirname, `../public/images/${email}.png`)}`
  );
  fs.unlink(avatarAddressInTmpFolder, (err) => {
    if (err) {
      throw err;
    }
  });
}

async function updateAvatar(req, res) {
  try {
    const { destination, filename } = req.file;
    const { _id, email } = req.user;
    const avatarAddressInTmpFolder = destination + "/" + filename;
    const files = await imagemin([avatarAddressInTmpFolder], {
      destination: "public/images/",
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
    fs.promises.unlink(avatarAddressInTmpFolder, (err) => {
      if (err) {
        throw err;
      }
    });
    userCurrentAvatarAddress = `${path.join(
      __dirname,
      `../public/images/${email}.png`
    )}`;
    userNewAvatarAddress = `${path.join(
      __dirname,
      `../public/images/${req.file.filename}`
    )}`;
    fs.rename(userNewAvatarAddress, userCurrentAvatarAddress, (err) => {
      if (err) throw err;
    });
    const avatarURL = `http://localhost:${PORT}/images/${email}.png`;
    res.status(200).send(`"avatarURL":${avatarURL}`);
  } catch (error) {
    res.status(401).send("Not authorized");
  };
};

async function isExistVerificationToken(req, res) {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    user
      ? ((user.verificationToken = ""), user.save(), res.status(200).send(null))
      : res.status(404).send("User not found");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  };
};

function validateDataOfUser(req, res, next) {
  const validationRules = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    res.status(400).send(validationResult.error.details[0].message);
  };
  next();
};

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).send("Email or password is wrong");
  };
  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    return res.status(401).send("Email or password is wrong");
  };
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
};

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
};

async function tokenChecking(req, res, next) {
  const authorizationHeader = req.get("Authorization");
  if (!authorizationHeader) {
    return res.status(401).send("Not authorized");
  };
  const token = authorizationHeader.replace("Bearer ", "");
  try {
    const { userId } = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId);
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).send("Not authorized");
  };
};

async function listUsers(req, res) {
  try {
    const listOfUsers = await User.find();
    res.status(200).send(listOfUsers);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  };
};

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
  };
};

async function removeUser(req, res) {
  try {
    const {
      params: { userId },
    } = req;
    deletedUser = await User.findByIdAndDelete(userId);
    deletedUser
      ? res.status(200).send({ message: "User is deleted" })
      : res.status(404).send({ message: "User not found" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  };
};

async function updateUser(req, res) {
  try {
    const {
      params: { userId },
    } = req;
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      {
        new: true,
      }
    );
    updatedUser
      ? res.status(200).send(updatedUser)
      : res.status(404).send({ message: "User not found" });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  };
};

function validateUpdateUser(req, res, next) {
  const validationRules = Joi.object({
    email: Joi.string(),
    password: Joi.string(),
    subscription: Joi.string().valid("pro", "premium", "free"),
  });
  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  };
  next();
};

function validateId(req, res, next) {
  const {
    params: { userId },
  } = req;
  if (!ObjectId.isValid(userId)) {
    return res.status(400).send("User id is not valid");
  };
  next();
};

function getCurrentUserData(req, res) {
  try {
    const { email, subscription } = req.user;
    res.status(200).send({ email, subscription });
  } catch (error) {
    res.status(500).send(error);
  };
};

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
  updateAvatar,
  isExistVerificationToken,
};
