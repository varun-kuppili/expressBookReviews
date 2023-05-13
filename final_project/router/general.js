const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }
  if(users[username]){
    return res.status(400).json({message: "Username already exists"});
  }
  users[username] = {
    username, 
    password
  };
  return res.status(201).json({message: "User created successfully"});
  //return res.status(300).json({message: "Up and running"});
});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {
  //Write your code here
  public_users.get('/',function (req, res) {
    res.json(books);
  });
  
 // return res.status(300).json({message: "Books list: Yet to be implemented"});
;

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  let isbn = req.params.isbn;
  let booksArray = Object.values(books);
let book = booksArray.find(b => b.isbn === isbn);
  //let book = books.find(b => b.isbn === isbn);
  res.json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let booksKeys = Object.keys(books);
  let authorBooks = [];
  for(let i=0; i<booksKeys.length; i++){
    if(books[booksKeys[i]].author === author){
      authorBooks.push(books[booksKeys[i]]);
    }
  }
  res.json(authorBooks);
 // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let booksKeys = Object.keys(books);
  let titleBooks = [];
  for(let i=0; i<booksKeys.length; i++){
    if(books[booksKeys[i]].title === title){
      titleBooks.push(books[booksKeys[i]]);
    }
  }
  res.json(titleBooks);
 // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let bookArray = Object.values(books);
  let book = bookArray.find(b => b.isbn === isbn);
  res.json(book.reviews);
 // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
