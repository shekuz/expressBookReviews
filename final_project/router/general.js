const express = require('express');
const { books } = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register a new user
public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({message:"Username or password missing"});
  }

  if(!isValid(username)){
    users.push({"username":username,"password":password});
    return res.status(200).json({message:"User successfully registered. Now you can login"});
  } else {
    return res.status(404).json({message:"User already exists!"});
  }

});


// Get the book list available in the shop
public_users.get('/', function (req, res) {

  return res.status(200).send(JSON.stringify(books, null, 4));

});


// Get book details based on ISBN
// general.js
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    // ✅ FIXED IMPORT
    const { books } = require("./booksdb.js");

    const book = books[isbn];

    if (book) {
        return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
        return res.status(404).json({
            message: "Book not found"
        });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;
  
    // Get all ISBN keys
    const bookKeys = Object.keys(books);
  
    let filteredBooks = [];
  
    // Iterate through books using keys
    bookKeys.forEach((key) => {
      if (books[key].author === author) {
        filteredBooks.push(books[key]);
      }
    });
  
    // Return results
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({
        message: "No books found for the given author"
      });
    }
  
  });


// Get all books based on title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;
  
    // Get all ISBN keys
    const bookKeys = Object.keys(books);
  
    let filteredBooks = [];
  
    // Iterate through books
    bookKeys.forEach((key) => {
      if (books[key].title === title) {
        filteredBooks.push(books[key]);
      }
    });
  
    // Return response
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({
        message: "No books found with the given title"
      });
    }
  
  });


// Get book review
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    const reviews = books[isbn].reviews;
  
    return res.status(200).json({
      isbn,
      totalReviews: Object.keys(reviews).length,
      reviews
    });
  
  });

  public_users.post('/register', function (req, res) {

    const username = req.body.username;
    const password = req.body.password;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }
  
    // Check if username already exists
    if (!isValid(username)) {
      return res.status(409).json({
        message: "Username already exists"
      });
    }
  
    // Register the new user
    users.push({
      username: username,
      password: password
    });
  
    return res.status(200).json({
      message: "User successfully registered. Now you can login"
    });
  
  });

module.exports.general = public_users;