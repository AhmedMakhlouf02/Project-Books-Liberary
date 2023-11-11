const db = require("../models");
const Loan = db.Loan;
const User = db.User;
const Books = db.Books;
const { Op } = require("sequelize");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

// Ubdate User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const updateUser = await User.update(
      {
        name,
        email,
      },
      {
        where: { id },
      }
    );
    if (!updateUser) {
      throw new NotFoundError(`No User with ID ${id}`);
    }
    res.status(StatusCodes.OK).json({name, email});
  } catch (error) {
    res.status(500).json({ error: "Failed to create book" });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.destroy({
      where: { id },
    });
    if (!deleteUser) {
      throw new NotFoundError(`No User with ID ${id}`);
    }
    res.status(StatusCodes.OK).send(`Deleted User`);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Failed to delete book" });
  }
};

// List all borrowers
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error:"There Something Wrong"})
  }
};

// Checkout a book
const checkoutBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      throw new BadRequestError(`User not found`);
    }

    const book = await Books.findByPk(bookId);
    if (!book) {
      throw new BadRequestError(`Book not found`);
    }
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 25);

    const loan = await Loan.create({
      userId,
      bookId,
      dueDate
    });

    res.status(StatusCodes.CREATED).json({ loan });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to checkout the book" });
  }
};

// Return a book
const returnBook = async (req, res) => {
  try {
    const { loanId } = req.body;

    const loan = await Loan.findByPk(loanId);
    if (!loan) {
      throw new BadRequestError(`There was no Loan`);
    }

    loan.returned = true;
    await loan.save();

    res.status(StatusCodes.OK).json({ message: "Book returned successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to return the book" });
  }
};

// Get book currently checked out by a user
const getCheckedOutBooks = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      include: [
        {
          model: Loan,
          as: "loans",
          where: { returned: false },
          include: [{ model: Books, as: "book" }],
        },
      ],
    });

    if (!user) {
      throw new BadRequestError(`User not found`);
    }

    res
      .status(StatusCodes.OK)
      .json({ book: user.loans.map((loan) => loan.book) });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to get checked out book" });
  }
};


// Get overdue book
const getOverdueBooks = async (req, res) => {
  try {
    const overdueLoans = await Loan.findAll({
      where: { dueDate: { [db.Sequelize.Op.lt]: new Date() }, returned: false },
      include: [
        { model: User, as: "user" },
        { model: Books, as: "book" },
      ],
    });

    if(!overdueLoans){
      throw new NotFoundError(`There are not Overdue Loans  `)
    }

    res.status(StatusCodes.OK).json({ loans: overdueLoans });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to get overdue books" });
  }
};

module.exports = {
  updateUser,
  deleteUser,
  getAllUsers,
  checkoutBook,
  returnBook,
  getCheckedOutBooks,
  getOverdueBooks,
};
