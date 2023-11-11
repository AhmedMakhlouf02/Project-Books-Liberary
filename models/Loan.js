
// Define the "Loan" model

module.exports = (sequelize, Sequelize) => {
  const Loan = sequelize.define("Loan", {
    dueDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    returned: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  Loan.associate = (models) => {
    Loan.belongsTo(models.User, { foreignKey: {
      allowNull: false
    }, as: "user" });

    Loan.belongsTo(models.Books, {
      foreignKey: { allowNull: false },
      as: "book",
    });
  };
    
    return Loan
    
};

