const dotenv = require("dotenv");

dotenv.config({ override: true });

const express = require("express");
const { PrismaClient } = require("./generated");
const { PrismaPg } = require("@prisma/adapter-pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authenticateToken = require("./middleware/authMiddleware");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(express.json());

// Fetch all blog posts from the database.
app.get("/api/posts", async (req, res) => {
  const posts = await prisma.post.findMany();
  res.json({ posts });
});

// Register a new user with hashed password storage.
app.post("/api/auth/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  res.json(user);
});

// Authenticate a user and return a JWT token.
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  ``}

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  res.json({ token });
});

// Create a new post for the authenticated user.
app.post("/api/posts", authenticateToken, async (req, res) => {
  const { title, content } = req.body;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: req.user.id,
    },
  });

  res.json(post);
});

app.get("/api/posts/:id", async(req, res) => {
    const post = await prisma.post.findUnique({
        where: {
            id: Number(req.params.id)
        }
    })

    if(!post) {
        return res.status(404).json({
            message: "Post not found"
        })
    }



    res.json(post)
})

app.put("/api/posts/:id", authenticateToken,async(req, res) => {
    const { title, content, published } = req.body;

    const post = await prisma.post.findUnique({
        where: {
            id: Number(req.params.id)
        }
    })


    if (!post){
        return res.status(404).json({
            message: "post not found"
        })

    }


    if (post.authorId !== req.user.id) {
        return res.status(403).json({
            message: "You are not allowed to edit this post "
        })
    }


    const updatedPost = await prisma.post.update({
        where: {
            id: Number(req.params.id)
        },
        data: {
            title,
            content,
            published
        }
    })

    res.json(updatedPost)
})


app.delete("/api/posts/:id", authenticateToken, async(req, res) => {

    const post = await prisma.post.findUnique({
        where : {
            id : Number(req.params.id)
        }
    })

    if(!post){
        return res.status(404).json({
            message : "Post not found"
        })
    }

    if (post.authorId !== req.user.id){
        return res.status(403).json({
            message : "You are not allowed to delete this post"
        })
    }

    await prisma.post.delete({
        where : {
            id : post.id
        }
    })

    res.json({
        message: "Post deleted successfully"
    })

})

app.patch("/api/posts/:id/publish", authenticateToken, async(req, res) => {
    const post = await prisma.post.findUnique({
        where : {
            id: Number(req.params.id)
        }
    })

    if(!post) {
        return res.status(404).json({
            message : "post not found"
        })
    }

    if(post.authorId !== req.user.id){
        return res.status(403).json({
            message: "You are not allowed to publish this post"
        })
    }

    const updatedPost = await prisma.post.update({
        where: {
            id: post.id
        },

        data: {
            published: !post.published
        }
    })

    res.json(updatedPost)
})


app.post("/api/posts/:id/comments", authenticateToken, async (req, res) => {
  const { content } = req.body;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(req.params.id)
    }
  });

  if (!post) {
    return res.status(404).json({
      message: "Post not found"
    });
  }

  const comment = await prisma.comment.create({
    data: {
      content,
      username: req.user.username,
      postId: post.id,
      userId : req.user.id
    }
  });

  res.json(comment);
});


app.get("/api/posts/:id/comments", async (req, res) => {
    const comments = await prisma.comment.findMany({
        where : {
            postId: Number(req.params.id)
        }
    })

    res.json({ comments })
})

app.delete("/api/comment/:id", authenticateToken,(req, res) => {

    const comment = await prisma.comment.findUnique({
        where : {
            id: Number(req.params.id)
        }
    })

    if(!comment) {
        return res.status(404).json({
            message: "Message not found"
        })
    }

    if(comment.userId !== req.params.id){
        return res.status(404).json({
            message: "You are not allowed to delete this comment"
        })
    }


    await prisma.comment.delete({
        where : {
            id: comment.Id
        }
    })

    res.json({
        message : "message deleted successfully"
    })
} )

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
