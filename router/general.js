const express = require('express');
let isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const { books } = require("./booksdb.js");
const axios = require('axios');


const public_users = express.Router();

public_users.get('/isbn/:isbn', async (req, res) => {

  const isbn = req.params.isbn;

  try {

    // Promise wrapper
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {

        const book = books[isbn];

        if (book) {
          resolve(book);
        } else {
          reject("Book not found");
        }

      });
    };

    const data = await getBookByISBN(isbn);

    return res.status(200).json(data);

  } catch (error) {

    return res.status(404).json({
      message: error
    });

  }

});

// ✅ REGISTER (FIXED LOGIC)
public_users.post("/register", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  // ❗ Correct logic
  if (!isValid(username)) {
    return res.status(409).json({
      message: "Username already exists"
    });
  }

  users.push({ username, password });

  console.log("USERS AFTER REGISTER:", users); // DEBUG

  return res.status(201).json({
    message: "User successfully registered"
  });

});

// Get All Books
public_users.get('/', async (req, res) => {

  try {

    const getBooks = () => {
      return new Promise((resolve, reject) => {

        if (books) {
          resolve(books);
        } else {
          reject("Books not found");
        }

      });
    };

    const data = await getBooks();

    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      message: "Error fetching books",
      error
    });
  }

});

// ✅ GET BY AUTHOR
public_users.get('/author/:author', async (req, res) => {

  const author = req.params.author;

  try {

    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {

        const filteredBooks = Object.values(books)
          .filter(book => book.author === author);

        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject("No books found for this author");
        }

      });
    };

    const data = await getBooksByAuthor(author);

    return res.status(200).json(data);

  } catch (error) {
    return res.status(404).json({ message: error });
  }

});


// GET BY TITLE
public_users.get('/title/:title', async (req, res) => {

  const title = req.params.title;

  try {

    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {

        const filteredBooks = Object.values(books)
          .filter(book => book.title === title);

        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject("No books found with this title");
        }

      });
    };

    const data = await getBooksByTitle(title);

    return res.status(200).json(data);

  } catch (error) {
    return res.status(404).json({ message: error });
  }

});

// ✅ GET REVIEWS
public_users.get('/isbn/:isbn', async (req, res) => {

  const isbn = req.params.isbn;

  try {

    const getBook = (isbn) => {
      return new Promise((resolve, reject) => {

        const book = books[isbn];

        if (book) {
          resolve(book);
        } else {
          reject("Book not found");
        }

      });
    };

    const data = await getBook(isbn);

    return res.status(200).json(data);

  } catch (error) {
    return res.status(404).json({ message: error });
  }

});

module.exports.general = public_users;