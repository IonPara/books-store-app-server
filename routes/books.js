const express = require("express");
const router = express.Router();

const { checkContentType } = require("../controllers/users.controllers");
// Import the controllers
const {
  addBook,
  deleteBook,
  editBook,
  getBooks,
  addReview,
} = require("../controllers/books.controllers");

// Here are all of the books routes
router.post("/addBook", checkContentType, addBook);
router.post("/addReview", checkContentType, addReview);
router.get("/getBooks", checkContentType, getBooks);
router.delete("/delete", checkContentType, deleteBook);
router.put("/edit", checkContentType, editBook);

module.exports = router;
