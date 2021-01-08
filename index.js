const importFunctions = require("./controllers/contacts");

const express = require("express");
const cors = require("cors");
const app = express();
const userRouter = require("./routes/user.routes");

var morgan = require("morgan");
const PORT = 3000;
app.use(cors({ orogin: `localhost:${PORT}` }));
app.use(morgan("combined"));
app.use(express.json());
app.use("/api/contacts", userRouter);

app.listen(PORT, () => {
  console.log("Server is listening on: ", PORT);
});
