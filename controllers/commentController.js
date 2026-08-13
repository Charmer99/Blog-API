const prisma = require("../db/prisma")


// Create a comment.
exports.createComment = async (req, res) => {
  const { content } = req.body;

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

  const comment = await prisma.comment.create({
    data: {
      content,
      username: req.user.username,
      post: {
        connect: {
          id: post.id,
        },
      },
      user: {
        connect: {
          id: req.user.id,
        },
      },
    },
  });

  res.json(comment);
};

// Get comments for a post.
exports.getComments = async (req, res) => {
  const comments = await prisma.comment.findMany({
    where: {
      postId: Number(req.params.id),
    },
  });

  res.json({ comments });
};

// Delete a comment.
exports.deleteComment =  async (req, res) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!comment) {
    return res.status(404).json({
      message: "Comment not found",
    });
  }

  if (comment.userId !== req.user.id) {
    return res.status(403).json({
      message: "You are not allowed to delete this comment",
    });
  }

  await prisma.comment.delete({
    where: {
      id: comment.id,
    },
  });

  res.json({
    message: "Comment deleted successfully",
  });
};

