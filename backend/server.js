import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const __dirname = path.resolve();

app.use(express.json());

app.use("/api/users", authRoutes);
app.use("/api/notes", notesRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API running" });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API running");
  });
}

const startServer = async () => {
  try {
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("PORT:", PORT);
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server started at port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();