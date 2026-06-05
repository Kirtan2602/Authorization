import express from "express";
import { dbconnection } from "./db/dbconnection.js";

const app = express();

// connect DB
dbconnection("your_db_name", "your_username", "your_password");

app.listen(3000, () => {
  console.log("Server running on port 3000");
});