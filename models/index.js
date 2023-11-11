const dbConfig = require('../config/db-config');
const Sequelize = require('sequelize');
// const Books = require('./Books');


const sequelize = new Sequelize(
  dbConfig.DATABASE,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    // operatorsAliases: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.Books = require('./Books')(sequelize, Sequelize.DataTypes);
db.Loan = require("./Loan")(sequelize, Sequelize.DataTypes);

// Define Associations
db.User.hasMany(db.Loan, { foreignKey: "userId", as: "userLoans" });
db.Loan.belongsTo(db.User, { foreignKey: "userId", as: "user" });

db.Books.hasMany(db.Loan, { foreignKey: "bookId", as: "bookLoans" });
db.Loan.belongsTo(db.Books, { foreignKey: "bookId", as: "book" });


module.exports = db;