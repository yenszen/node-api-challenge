const express = require("express");
const projectRouter = require("./routers/projectRouter");
const actionRouter = require("./routers/actionRouter");

const server = express();

server.use(express.json());
server.use("/api/projects", projectRouter);
server.use("/api/actions", actionRouter);

server.get("/", (req, res) => {
  res.status(200).send("Node Api Challenge");
});

module.exports = server;
