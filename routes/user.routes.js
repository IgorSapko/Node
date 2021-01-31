const { Router } = require("express");
const userRouter = Router();
const userRouterAuth = Router();

const importFunctions = require("../controllers/users");

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

userRouter.patch(
  `/:userId`,
  importFunctions.tokenChecking,
  importFunctions.validateId,
  importFunctions.validateUpdateUser,
  importFunctions.updateUser
);

userRouter.get(
  `/current`,
  importFunctions.tokenChecking,
  importFunctions.getCurrentUserData
);

module.exports = { userRouterAuth, userRouter};
