//module imports
const { Router } = require("express");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const prisma = require("../db/prisma")

//middleware imports
const authenticateToken = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const authController = require("../controllers/authControllers")
const { registerValidation, loginValidation, validationHandler } = require("../middleware/validation")

const router = Router()

//register route
router.post("/register",registerValidation, validationHandler, asyncHandler(authController.register));

//login route
router.post("/login", loginValidation, validationHandler, asyncHandler(authController.login));

module.exports = router;