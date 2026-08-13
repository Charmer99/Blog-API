//module imports
const { Router } = require("express");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const prisma = require("../db/prisma")

//middleware imports
const authenticateToken = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");
const authController = require("../controllers/authControllers")

const router = Router()

//register route
router.post("/register", asyncHandler(authController.register));

//login route
router.post("/login", asyncHandler(authController.login));

module.exports = router;