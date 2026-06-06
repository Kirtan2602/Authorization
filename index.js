import express from "express";
import sequelize from "./db/dbconnection.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

// routes
app.use("/api", userRoutes);

// connect DB + start server
sequelize
  .sync()
  .then(() => {
    console.log("Database connected");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting DB:", err);
  });