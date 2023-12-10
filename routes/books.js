import express from "express";
import {
  currentUser,
  isOwnComment,
  isOwnBook,
  isAuthorized,
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
import multer from "../utils/multer.js";

const router = express.Router();
router.get("/my-books", currentUser, fetchCurrentUserBooks);
router.get("/", fetchBooks);
router.get("/author/:id", fetchBookByAuthorId);
router.get("/search", searchBooks);
router.get("/:id", fetchBookById);
router.post("/", currentUser, isAuthorized, create);
router.post("/comment", currentUser, createComment);
router.delete("/comment/:id", currentUser, deleteComment);
router.patch("/:id", currentUser, isAuthorized, isOwnBook, updateBook);
router.delete("/:id", currentUser, isAuthorized, isOwnBook, deleteBook);
export default router;
