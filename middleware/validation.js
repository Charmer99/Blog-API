const { body, validationResult } = require("express-validator");

const registerValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required"),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
];


const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
]

const validationHandler = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array(),
        })
    }
    next()
}

module.exports = {
  registerValidation,
  loginValidation,
  validationHandler,
};