// commentRoutes.js

//module imports
const { Router } = require("express");


const commentController =  require("../controllers/commentController")

//middleware imports
const authenticateToken = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const { commentValidation, 
    validationHandler }
    = require("../middleware/validation")

const router = Router();

router.get(
  "/comments",
  authenticateToken,
  authorizeAuthor,
  asyncHandler(commentController.getAllComments)
);
// Create a comment.
router.post(
    "/posts/:id/comments",
     authenticateToken,
     commentValidation, 
     validationHandler,
      asyncHandler(commentController.createComment));

// Get comments for a post.
router.get(
    "/posts/:id/comments", 
    asyncHandler(commentController.getComments))

// Delete a comment.
router.delete(
    "/comments/:id", 
    authenticateToken,
     asyncHandler(commentController.deleteComment));

module.exports = router;