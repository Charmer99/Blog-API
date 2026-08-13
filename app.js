const dotenv = require("dotenv");
dotenv.config({ override: true });

const express = require("express");

//import middleware
const errorHandler = require("./middleware/errorHandler")

//import routes
const authRoutes = require("./routes/authRoutes")
const postRoutes = require("./routes/postRoutes")
const commentRoutes = require("./routes/commentRoutes")

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts",postRoutes );
app.use("/api", commentRoutes)

// Error handler MUST come after the routes.
app.use(errorHandler);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});