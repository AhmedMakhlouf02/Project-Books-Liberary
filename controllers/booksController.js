const db = require("../models");
const Books = db.Books;
const { StatusCodes } = require("http-status-codes");
const { Op } = require("sequelize");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

// Create a new book
const createBook = async (req, res) => {
  try {
    const { title, author, ISBN, availableQuantity, shelfLocation } = req.body;
    const book = await Books.create({
      title,
      author,
      ISBN,
      availableQuantity,
      shelfLocation,
    });
    res.status(StatusCodes.CREATED).json({book});
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create book' });
  }
};

// Update a book's details
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, ISBN, availableQuantity, shelfLocation } = req.body;
    const [updatedRowsCount] = await Books.update(
      {
        title,
        author,
        ISBN,
        availableQuantity,
        shelfLocation,
      },
      {
        where: { id },
      }
    );
    if (updatedRowsCount === 0) {
      return res.status(NotFoundError).json({ error: "Book not found" });
    }
    const updatedBook = await Books.findByPk(id);
    res.status(StatusCodes.OK).json(updatedBook);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to update book" });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRowCount = await Books.destroy({
      where: { id },
    });
    if (deletedRowCount === 0) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.status(StatusCodes.OK).json({ message: "Book deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to delete book" });
  }
};

// List all books
const listBooks = async (req, res) => {
  try {
    const books = await Books.findAll();
    res.status(StatusCodes.OK).json(books);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to retrieve books" });
  }
};

// Search Book
const searchBook = async (req, res) => {
  try {
    const { query } = req.query;

    const books = await Books.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { author: { [Op.like]: `%${query}%` } },
          { ISBN: { [Op.like]: `%${query}%` } },
        ],
      },
    });

    res.status(StatusCodes.OK).json({ books });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to search books" });
  }
};

// Export the controller functions
module.exports = {
  createBook,
  updateBook,
  deleteBook,
  listBooks,
  searchBook,
};
