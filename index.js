const importFunctions = require("./controllers/contacts");
const mongoose = require("mongoose");

const express = require("express");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/user.routes");
const MONGO_PASS = "Mhr23SIsPIF5WSCM";
const MONGO_URL = `mongodb+srv://Admin:${MONGO_PASS}@cluster0.elolo.mongodb.net/db-contacts`;

var morgan = require("morgan");
const { startSession } = require("./models/contacts");
const PORT = 3000;
app.use(cors({ orogin: `localhost:${PORT}` }));
app.use(morgan("combined"));
app.use(express.json());
app.use("/api/contacts", userRouter);
// startConnectionToDBAndListeningOfSrver();

(async function startConnectionToDBAndListeningOfSrver() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log("Server is listening on: ", PORT);
    });
  } catch (error) {
    process.exit(1);
  }
})();
