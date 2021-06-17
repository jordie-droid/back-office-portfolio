require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const server = express();

server.use(express.json());
server.use(cors());

const connection = mysql.createConnection({
  host: process.env.DB_HOST || "sql4.freemysqlhosting.net",
  user: process.env.DB_USER || "sql4419467",
  password: process.env.DB_PASSWORD || "uVqSI8mGSE",
  database: process.env.DATABASE || "sql4419467",
});

connection.connect((error) => {
  if (error) {
    console.error("connection failure : ", error.stack);
  }
  console.log("successful connecting to the database");
});

server.get("/", (request, response) => {
  connection.query("SELECT * FROM projects", (error, result) => {
    if (error) {
      response.status(500).json({ error: "Internal erro" });
    }
    response.status(200).json({ result });
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`The server is running on : ${PORT}`);
});
