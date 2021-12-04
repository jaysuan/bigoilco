const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const intakeRouter = require("./intake/router");
const clientRouter = require("./client/router");
const valuesRouter = require("./values/router");
const reportRouter = require("./report/router");
const userRouter = require("./user/router");
const auditRouter = require("./audit/router");
const bhoRouter = require("./bho/router");

const app = express();
app.use(cors({ origin: true }));

app.get("/", (req, res) => res.json({
    message: "Hello, Big Oil Co!"
}))
app.get("/healthcheck", (req, res) => res.json({
    message: "UP"
}));

// Intake router
app.use("/v1/intake", intakeRouter);

// Client router
app.use("/v1/client", clientRouter);

// Values router
app.use("/v1/values", valuesRouter);

// Report router
app.use("/v1/report", reportRouter);

// User router
app.use("/v1/user", userRouter);

// Audit Logs router
app.use("/v1/audit", auditRouter);

// BHO router
app.use("/v1/bho", bhoRouter);

exports.api = functions.https.onRequest(app);
