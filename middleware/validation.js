// validation.js

const { body, param, validationResult } = require("express-validator");

const registerValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({min: 3, max: 30})
    .withMessage("username must be between 3 and 30 characters"),

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

const postValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),

    body('content')
        .trim()
        .notEmpty()
        .withMessage("Content is required")
]

const updatePostValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("title is required"),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required"),

    body("published")
        .optional()
        .isBoolean()
        .withMessage("Published must be true or false"),
    ]

const commentValidation = [
    body("content")
        .trim()
        .notEmpty()
        .withMessage("Comment content is required")
]

const idValidation = [
    param("id")
        .isInt({min: 1})
        .withMessage("Id must be a postive integer")
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
  postValidation,
  updatePostValidation,
  commentValidation,
  idValidation,
  validationHandler,
};