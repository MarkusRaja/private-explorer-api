const express = require("express");
const cors = require("cors");
const environments = require("./environments");
const { fetch } = require("./blockchain");

// * Middlewares
const { errorMiddleware } = require("./middlewares");

// * Routes
const helloRoute = require("./routes/hello.route");
const explorerRoute = require("./routes/explorer.route");

const app = express();

app.use(express.json());
app.use(cors());
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  next();
});

app.use("/api", helloRoute);
app.use("/api/explorer", explorerRoute);

app.use(errorMiddleware);

app.listen(environments.PORT, () => {
  console.info(
    `App started on http://${environments.HOST}:${environments.PORT}`
  );

  setInterval(fetch, 30000);
});
