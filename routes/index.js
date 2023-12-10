import express from "express";
const router = express.Router();
import userRoutes from "./users.js";
import authRoutes from "./auth.js";
import authorsRoutes from "./authors.js";
import booksRoutes from "./books.js";
import filesRoutes from "./files.js";

router.use("/api", authRoutes);
router.use("/api/users", userRoutes);
router.use("/api/authors", authorsRoutes);
router.use("/api/books", booksRoutes);
router.use("/api/files", filesRoutes);

export default router;
