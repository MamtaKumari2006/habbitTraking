const express = require("express");
const { signUp, login, logout} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();


router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;