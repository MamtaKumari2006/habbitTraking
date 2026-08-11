const express = require("express");
const { signUp, login, logout} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;