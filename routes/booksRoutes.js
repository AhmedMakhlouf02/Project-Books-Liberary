const express = require("express");
const router = express.Router();

const { createBook, updateBook, deleteBook, listBooks, searchBook } = require("../controllers/booksController");

router.route("/").get(listBooks);
router.route("/:id").delete(deleteBook).patch(updateBook).post(createBook);
router.route("/search").get(searchBook);

module.exports = router;
