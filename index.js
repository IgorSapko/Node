const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
var morgan = require("morgan");

// const importFunctions = require("./controllers/contacts");
const contactRouter = require("./routes/contact.routes");
const { userRouterAuth, userRouter } = require("./routes/user.routes");

require("dotenv").config();

const MONGO_PASS = process.env.MONGO_PASS;
const PORT = process.env.PORT;
const MONGO_URL = `mongodb+srv://Admin:${MONGO_PASS}@cluster0.elolo.mongodb.net/db-contacts`;

const { startSession } = require("./models/contacts");
const app = express();
app.use(cors({ orogin: `localhost:${PORT}` }));
app.use(morgan("combined"));
app.use(express.json());
app.use("/api/contacts", contactRouter);
app.use("/auth", userRouterAuth);
app.use("/users", userRouter);

(async function startConnectionToDBAndListeningOfSrver() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log("Server is listening on port: ", PORT);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();
