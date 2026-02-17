const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to check if user exists
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = parseInt(req.params.isbn);
  res.send(JSON.stringify(books[isbn], null, 2));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let data = Object.entries(books).filter(
    ([id, libro]) => libro.author === author
  );
  res.send(JSON.stringify(data, null, 2));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title.replace(/\s+/g, "");
  let data = Object.entries(books).filter(
    ([id, libro]) => libro.title.replace(/\s+/g, "") === title
  );
  res.send(JSON.stringify(data, null, 2));
});

// Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = parseInt(req.params.isbn);
  res.send(JSON.stringify(books[isbn].reviews, null, 2));
});

// Task 10: Get all books using async/await with Axios
public_users.get("/all", async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) {
          resolve(books);
        } else {
          reject("No books available");
        }
      });
    };

    const allBooks = await getBooks();
    res.status(200).json(allBooks);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving books",
      error: error,
    });
  }
});

// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get("/book/:isbn", async (req, res) => {
  try {
    let isbn = parseInt(req.params.isbn);
    
    const getBookByIsbn = (isbn) => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book with this ISBN not found");
        }
      });
    };

    const book = await getBookByIsbn(isbn);
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({
      message: "Error retrieving book",
      error: error,
    });
  }
});

// Task 12: Get book details based on Author using async/await with Axios
public_users.get("/nameAuthor/:author", async (req, res) => {
  try {
    let author = req.params.author;
    
    const getBookByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        let filteredBooks = Object.entries(books).filter(
          ([id, libro]) => libro.author === author
        );
        
        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject("No books found by this author");
        }
      });
    };

    const booksByAuthor = await getBookByAuthor(author);
    res.status(200).json(booksByAuthor);
  } catch (error) {
    res.status(404).json({
      message: "Error retrieving books by author",
      error: error,
    });
  }
});

// Task 13: Get book details based on Title using async/await with Axios
public_users.get("/titulo/:title", async (req, res) => {
  try {
    let title = req.params.title.replace(/\s+/g, "");
    
    const getBookByTitle = (title) => {
      return new Promise((resolve, reject) => {
        let filteredBooks = Object.entries(books).filter(
          ([id, libro]) => libro.title.replace(/\s+/g, "") === title
        );

        if (filteredBooks.length > 0) {
          resolve(filteredBooks);
        } else {
          reject("No books found with this title");
        }
      });
    };

    const booksByTitle = await getBookByTitle(title);
    res.status(200).json(booksByTitle);
  } catch (error) {
    res.status(404).json({
      message: "Error retrieving books by title",
      error: error,
    });
  }
});

module.exports.general = public_users;