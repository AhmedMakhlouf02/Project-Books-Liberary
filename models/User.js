const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

// Define the "User" model

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(64),
        allowNull: false,
       
      },
    },
    {
      freezeTableName: true,
    }
  );

  User.beforeCreate(async (user) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
    } catch (error) {
      console.error(`Error hashing password ${error}`);
    }
  });

  User.prototype.createJWT = function () {
  
    return  jwt.sign({id:this.id, name: this.name}, process.env.JWT_SECRET ,{expiresIn: process.env.JWT_LIFETIME})
  };

  User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  
  User.associate = (models) => {
    User.hasMany(models.Loan, { foreignKey: "userId", as: "userLoans" });
  };
  

  return User;
};
