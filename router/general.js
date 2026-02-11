const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "El Mario Bombaaaa!"});
  res.send(JSON.stringify(books));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn);

  res.send(JSON.stringify(books[isbn]));
  //return res.status(300).json({message: "Ayyy amorrrr, no se que tiene tu mirarrr"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;

  let data = Object.entries(books)
              .filter(([id,libro])=>libro.author === author);

  res.send(JSON.stringify(data));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title.replace(/\s+/g, '');;

  let data = Object.entries(books)
              .filter(([id,libro])=>libro.title.replace(/\s+/g, '') === title);

  res.send(JSON.stringify(data));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
