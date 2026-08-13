// authControllers.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const prisma = require("../db/prisma")


exports.register = async (req, res) => {
  const { username, email, password } = req.body;


  const existingUser = await prisma.user.findUnique({
    where: {
      email
    }
  })

  if(existingUser) {
    return res.status(409).json({
      message: "Email is already registered"
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,

    },
  });

  res.status(201).json(user);
};

//login controller
exports.login =  async (req, res) => {
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
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({ token });
};
