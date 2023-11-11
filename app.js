require("dotenv").config();
require("express-async-errors");

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const bodyParser = require("body-parser");

const mysql2 = require('mysql2');
const express = require("express");
const app = express();
const db = require('./models');
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("database", "username", "password", {
  dialect: "mysql",
  host: "localhost",
});


// route
const authRouter = require("./routes/auth");
const userRouter = require("./routes/userRoutes");
const booksRouter = require("./routes/booksRoutes");


// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");


// middelwares
const authenticateUser = require("./middleware/authentication");
app.set("trust proxy", 1);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/borrower", authenticateUser, userRouter);
app.use("/api/v1/books", booksRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 8080;

// **** Synchronize the model with the database ****
async function syncModel() {
  try {
    await db.sequelize.sync();
    console.log('Model synchronized SUCCESSFUllY');
  } catch (error) {
    console.error('Error synchronizing model:', error);
  }
}
syncModel();

const connection = mysql2.createConnection({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD,
});





const start = async () => {
  try {
    await connection.connect((err) => {
      if (err) throw err;
      console.log(`DATABASE CONNECTED`);
    });
    app.listen(PORT, () =>
      console.log(`Server is listening on PORT ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
