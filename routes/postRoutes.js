//module imports
const { Router } = require("express");


const postController = require("../controllers/postController.js")

//middleware imports
const authenticateToken = require("../middleware/authMiddleware");
const asyncHandler = require("../middleware/asyncHandler");

const router = Router();


// Fetch all blog posts from the database.
router.get("/", asyncHandler(postController.fetchPosts));

// Create a new post for the authenticated user.
router.post("/", authenticateToken, asyncHandler(postController.createPost));

// Get one post.
router.get("/:id", asyncHandler(postController.getOnePost));

// Update a post.
router.put("/:id", authenticateToken, asyncHandler(postController.updatePost));

// Delete a post.
router.delete("/:id", authenticateToken, asyncHandler(postController.deletePost));

// Publish/unpublish a post.
router.patch("/:id/publish", authenticateToken, asyncHandler(postController.togglePublish));


module.exports = router;