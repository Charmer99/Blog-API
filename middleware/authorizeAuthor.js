// authorizeAuthor.js

function authorizeAuthor(req, res, next) {
  if (req.user.role !== "author") {
    return res.status(403).json({
      message: "Author access required"
    });
  }

  next();
}

module.exports = authorizeAuthor;