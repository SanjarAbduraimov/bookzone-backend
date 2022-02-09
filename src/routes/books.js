const express = require("express");
const {
  currentUser,
  isOwnComment,
  isOwnBook,
  isAuthorized,
} = require("../utils");
const {
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
} = require("../controller/books");
var multer = require("../utils/multer");

const router = express.Router();
router.get("/my-books", currentUser, fetchCurrentUserBooks);
router.get("/", fetchBooks);
router.get("/author/:id", fetchBookByAuthorId);
router.get("/search", searchBooks);
router.get("/:id", fetchBookById);
router.post("/", currentUser, isAuthorized, multer.array("files"), create);
router.post("/comment", currentUser, createComment);
router.delete("/comment/:id", currentUser, deleteComment);
router.patch("/:id", currentUser, isAuthorized, isOwnBook, updateBook);
router.delete("/:id", currentUser, isAuthorized, isOwnBook, deleteBook);
module.exports = router;
