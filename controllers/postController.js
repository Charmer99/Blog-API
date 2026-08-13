// postController.js

const prisma = require("../db/prisma")




// Fetch all blog posts from the database.
exports.fetchPosts =  async (req, res) => {
  const posts = await prisma.post.findMany({
    where: {
      published: true
    }
  });

  res.json({ posts });
};


// Fetch all posts for the author dashboard.
exports.fetchAllPosts = async (req, res) => {
  const posts = await prisma.post.findMany();

  res.json({ posts });
};

// Create a new post for the authenticated user.
exports.createPost = async (req, res) => {
  const { title, content } = req.body;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: req.user.id,
    },
  });

  res.status(201).json(post);
};

// Get one post. 
exports.getOnePost =async (req, res) => {
  const post = await prisma.post.findFirst({
    where: {
      id: Number(req.params.id),
      published: true
    },
  });

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  res.json(post);
};

// Update a post.
exports.updatePost =  async (req, res) => {
  const { title, content, published } = req.body;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  if (post.authorId !== req.user.id) {
    return res.status(403).json({
      message: "You are not allowed to edit this post",
    });
  }

  const updatedPost = await prisma.post.update({
    where: {
      id: post.id,
    },
    data: {
      title,
      content,
      published,
    },
  });

  res.json(updatedPost);
};

// Delete a post.
exports.deletePost =  async (req, res) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  if (post.authorId !== req.user.id) {
    return res.status(403).json({
      message: "You are not allowed to delete this post",
    });
  }

  await prisma.post.delete({
    where: {
      id: post.id,
    },
  });
  
//204 means: The operation succeeded, 
// but there is no response body.
  res.status(204).send();
};

// Publish/unpublish a post.
exports.togglePublish = async (req, res) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  if (post.authorId !== req.user.id) {
    return res.status(403).json({
      message: "You are not allowed to publish this post",
    });
  }

  const updatedPost = await prisma.post.update({
    where: {
      id: post.id,
    },
    data: {
      published: !post.published,
    },
  });

  res.json(updatedPost);
};

