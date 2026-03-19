const express = require('express');
const { books } = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  if (isValid(username)) {  // Assuming isValid() returns true if username ALREADY exists
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username, password });

  return res.status(201).json({
    message: "User successfully registered. Now you can login"
  });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  }

  return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const bookKeys = Object.keys(books);

  const filteredBooks = bookKeys
    .filter(key => books[key].author === author)
    .map(key => books[key]);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  }

  return res.status(404).json({ message: "No books found for the given author" });
});

// Get books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const bookKeys = Object.keys(books);

  const filteredBooks = bookKeys
    .filter(key => books[key].title === title)
    .map(key => books[key]);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  }

  return res.status(404).json({ message: "No books found with the given title" });
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const reviews = books[isbn].reviews || {};

  return res.status(200).json({
    isbn,
    totalReviews: Object.keys(reviews).length,
    reviews
  });
});

module.exports.general = public_users;