const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//let users = [];

const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (doesExist(username) === false) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "El Mario Bombaaaa!"});
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn);

  res.send(JSON.stringify(books[isbn]));
  //return res.status(300).json({message: "Ayyy amorrrr, no se que tiene tu mirarrr"});
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let author = req.params.author;

  let data = Object.entries(books).filter(
    ([id, libro]) => libro.author === author,
  );

  res.send(JSON.stringify(data));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let title = req.params.title.replace(/\s+/g, "");

  let data = Object.entries(books).filter(
    ([id, libro]) => libro.title.replace(/\s+/g, "") === title,
  );

  res.send(JSON.stringify(data));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here

  let isbn = parseInt(req.params.isbn);

  res.send(JSON.stringify(books[isbn].reviews));
});

public_users.get("/all", async (req, res) => {
  try {
    // Simular operación asíncrona con los datos locales
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) {
          resolve(books);
        } else {
          reject("No hay libros disponibles");
        }
      });
    };

    const libros = await getBooks();
    res.status(200).json(libros);
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error,
    });
  }
});


public_users.get("/book/:isbn", async (req, res) => {
  try {
    let isbn = parseInt(req.params.isbn);
    const getBookByIsbn = (isbn) => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("There is not book with this isbn yet");
        }
      });
    };
    const libro = await getBookByIsbn(isbn);
    res.status(200).json(libro);
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error,
    });
  }
});

public_users.get("/nameAuthor/:author", async (req, res) => {
  try {
    let author = req.params.author;
    const getBookByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        let data = Object.entries(books).filter(
          ([id, libro]) => libro.author === author,
        );
        if (data) {
          resolve(data);
        } else {
          reject("There is not book with this author");
        }
      });
    };
    const libro = await getBookByAuthor(author);
    res.status(200).json(libro);
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error,
    });
  }
});

public_users.get("/titulo/:title", async (req, res) => {
  try {
    let title = req.params.title.replace(/\s+/g, "");
    const getBookBytitle = (title) => {
      return new Promise((resolve, reject) => {
        let data = Object.entries(books).filter(
          ([id, libro]) => libro.title.replace(/\s+/g, "") === title,
        );

        if (data) {
          resolve(data);
        } else {
          reject("There is not book with this title yet");
        }
      });
    };
    const libro = await getBookBytitle(title);
    res.status(200).json(libro);
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error,
    });
  }
});

module.exports.general = public_users;
