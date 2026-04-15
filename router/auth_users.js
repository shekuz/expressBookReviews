const express = require('express');
const jwt = require('jsonwebtoken');
const { books } = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// ====================== VALIDATION ======================
const isValid = (username) => !users.some(u => u.username === username);

const authenticatedUser = (username, password) => 
    users.some(u => u.username === username && u.password === password);

// ====================== REGISTER ======================
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(409).json({ message: "Username already exists!" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered. You can now login." });
});

// ====================== LOGIN ======================
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ username }, "access", { expiresIn: 3600 });

        req.session.authorization = { accessToken, username };

        return res.status(200).json({
            message: "User successfully logged in",
            accessToken,
            username
        });
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});

// ====================== TASK 8: ADD / MODIFY REVIEW ======================
// ====================== TASK 8: ADD / MODIFY BOOK REVIEW ======================
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.query.review;                    // ← Review comes from query parameter
    const username = req.session?.authorization?.username;

    // Validation
    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    if (!review) {
        return res.status(400).json({ message: "Review text is required" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews object if it doesn't exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update review (same user overwrites their previous review)
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review successfully posted/updated",
        isbn: isbn,
        reviewedBy: username,
        review: review
    });
});
// ====================== TASK 9: DELETE REVIEW ======================
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
  
    // Ensure user is logged in
    if (!req.session.authorization) {
      return res.status(403).json({ message: "User not logged in" });
    }
  
    const username = req.session.authorization.username;
  
    // Check if book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if user has a review
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({
        message: "No review found for this user"
      });
    }
  
    // Delete the review
    delete books[isbn].reviews[username];
  
    return res.status(200).json({
      message: "Review deleted successfully"
    });
  
  });

module.exports = {
    authenticated: regd_users,
    isValid,
    users
};