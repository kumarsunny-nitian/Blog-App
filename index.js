const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
// const { checkForAuthenticationCookie } = require("./middlewares/auth"); // uncomment when you add auth middleware

const app = express();
const PORT = 8000;

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/blogify")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Set EJS view engine and views path
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(checkForAuthenticationCookie("token")); 
app.use(express.static(path.resolve("./public")));

// Middleware to make `user` always available in all EJS templates
app.use((req, res, next) => {
  res.locals.user = req.session?.user || null; // or req.user if using auth middleware
  next();
});

// Home route
app.get("/", async(req, res) => {
    const allBlogs = await Blog.find({});
  res.render("home", {
    user: res.locals.user,
    blogs: allBlogs,
  });
});

// Use routes
app.use("/user", userRoute);
app.use("/blog", blogRoute);

// Start server
app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
