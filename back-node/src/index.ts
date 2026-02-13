import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import postRoutes from "./routes/posts.js";
import uploadRoutes from "./routes/upload.js";

const app = express();
const PORT = process.env.PORT || 3001;

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(err.status || 500).json({
      error: err.message || "Internal Server Error",
    });
  },
);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
