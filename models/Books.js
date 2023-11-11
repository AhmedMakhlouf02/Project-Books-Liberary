const { DataTypes } = require("sequelize");

// Define the "Book" model
module.exports = (sequelize, Sequelize) => {
  const Books = sequelize.define(
    "Book",
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ISBN: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      availableQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      shelfLocation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  Books.associate = (models) => {
    Books.hasMany(models.Loan, { foreignKey: "bookId", as: "bookLoans" });
  };

  return Books;
};
