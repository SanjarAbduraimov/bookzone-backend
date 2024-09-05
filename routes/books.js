import express from "express";
import {
  isOwnComment,
  isOwnBook,
  isAuthorized,
  auth,
} from "../utils/index.js";
import {
  create,
  createComment,
  fetchBookByAuthorId,
  fetchBooks,
  searchBooks,
  fetchBookById,
  updateBook,
  deleteBook,
  deleteComment,
  fetchCurrentUserBooks,
} from "../controller/books.js";
import upload from "../utils/multer.js";

const router = express.Router();
router.get("/my-books", auth, fetchCurrentUserBooks);
router.get("/", fetchBooks);
router.get("/author/:id", fetchBookByAuthorId);
router.get("/search", searchBooks);
router.get("/:id", fetchBookById);
router.post("/", auth, isAuthorized, upload.single("image"), create);
router.post("/comment", auth, createComment);
router.delete("/comment/:id", auth, isOwnComment, deleteComment);
router.patch("/:id", auth, isAuthorized, isOwnBook, upload.single("image"), updateBook);
router.delete("/:id", auth, isAuthorized, isOwnBook, deleteBook);
export default router;
