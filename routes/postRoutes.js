// postRoutes.js

//module imports
const { Router } = require("express");


const postController = require("../controllers/postController.js")

//middleware imports
const authenticateToken = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const authorizeAuthor = require("../middleware/authorizeAuthor");

const { 
    postValidation, 
    updatePostValidation, 
    idValidation, 
    validationHandler }
     = require("../middleware/validation")

const router = Router();


// Fetch all blog posts from the database.
router.get("/", 
    asyncHandler(postController.fetchPosts));



router.get(
  "/admin",
  authenticateToken,
  authorizeAuthor,
  asyncHandler(postController.fetchAllPosts)
);

// Create a new post for the authenticated user.
router.post(
    "/", 
    authenticateToken, 
      authorizeAuthor,
    postValidation, 
    validationHandler, 
    asyncHandler(postController.createPost));

// Get one post.
router.get(
    "/:id", 
    idValidation, 
    validationHandler, 
    asyncHandler(postController.getOnePost));

// Update a post.
router.put(
    "/:id",
    idValidation, 
    authenticateToken, 
    authorizeAuthor,
    updatePostValidation, 
    validationHandler, 
    asyncHandler(postController.updatePost));

// Delete a post.
router.delete(
    "/:id", 
    authenticateToken,
      authorizeAuthor,
    idValidation,
    validationHandler,
    asyncHandler(postController.deletePost));

// Publish/unpublish a post.
router.patch(
  "/:id/publish",
  authenticateToken,
    authorizeAuthor,
  idValidation,
  validationHandler,
  asyncHandler(postController.togglePublish)
);


module.exports = router;