const express = require("express");
const router = express.Router();
const {
  updateUser,
  deleteUser,
  getAllUsers,
  checkoutBook,
  returnBook,
  getCheckedOutBooks,
  getOverdueBooks,
} = require("../controllers/userController");

router.route('/').get(getAllUsers);
router.route('/:id').patch(updateUser).delete(deleteUser);
router.route('/:id/checkout').post(checkoutBook);
router.route("/:id/return").post(returnBook);
router.route("/:id/checkedout").get(getCheckedOutBooks);
router.route("/:id/overdue").get(getOverdueBooks);


module.exports = router;
