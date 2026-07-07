const {
  loginUser,
  registerUser,
  adminLogin,
} = require("../controllers/userController");
const router = require("express").Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/admin", adminLogin);

module.exports = router;
