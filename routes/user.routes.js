const multer = require("multer");
// const tmp = multer({ dest: "tmp" });
const path = require('path');

const { Router } = require("express");
const userRouter = Router();
const userRouterAuth = Router();

const importFunctions = require("../controllers/users");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
cb(null, 'tmp')    
  },
  filename: function (req, file, cb) {
    console.log('file', file)
const {name, ext} = path.parse(file.originalname);
const nameFinalFile = `${name}${ext}`    ;
cb(null, nameFinalFile)
  }
});
const tmp = multer({storage});

userRouterAuth.post(
  "/register",
  importFunctions.validateDataOfUser,
  importFunctions.registerUser
);
userRouterAuth.post(
  "/login",
  importFunctions.validateDataOfUser,
  importFunctions.login
);

userRouterAuth.post(
  "/logout",
  importFunctions.tokenChecking,
  importFunctions.logOut
);

userRouter.get("/", importFunctions.tokenChecking, importFunctions.listUsers);

userRouter.get(
  `/:userId`,
  importFunctions.tokenChecking,
  importFunctions.validateId,
  importFunctions.getUserById
);

userRouter.delete(
  `/:userId`,
  importFunctions.tokenChecking,
  importFunctions.validateId,
  importFunctions.removeUser
);

userRouter.get(
  `/current`,
  importFunctions.tokenChecking,
  importFunctions.getCurrentUserData
);

userRouter.patch(
  `/avatars`,
  importFunctions.tokenChecking,
  tmp.single('avatar'),
  importFunctions.updateAvatar
);

userRouter.patch(
  `/:userId`,
  importFunctions.tokenChecking,
  importFunctions.validateId,
  importFunctions.validateUpdateUser,
  importFunctions.updateUser
);

module.exports = { userRouterAuth, userRouter };
