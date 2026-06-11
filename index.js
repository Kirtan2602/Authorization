import express from "express";
import sequelize from "./db/dbconnection.js";
import userRoutes from "./routes/userRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

// routes
app.use("/api", userRoutes);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
// connect DB + start server
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connected");

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting DB:", err);
  });