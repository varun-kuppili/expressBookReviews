const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check if the username is valid
};

const authenticatedUser = (username, password) => { //returns boolean
  console.log(users);
  console.log(username, password);
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      return true;
    }
  }
  return false;
};

// middleware to decode the JWT token and set the `user` property on the `req` object
const decodeToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token is invalid' });
    }
    req.user = decoded;
    next();
  });
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (authenticatedUser(username, password)) {
    // generate JWT token
    const token = jwt.sign({ username }, 'secretkey');
    return res.status(200).json({ message: 'Login successful', token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Add a book review
regd_users.put('/auth/review/:isbn', decodeToken, (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  // check if the user has already reviewed the book
  let bookIndex = books.findIndex((book) => book.isbn === isbn && book.reviews.find((r) => r.username === username));
  if (bookIndex === -1) {
    // add a new review
    bookIndex = books.findIndex((book) => book.isbn === isbn);
    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }
    books[bookIndex].reviews.push({ username, review });
  } else {
    // modify existing review
    const userReviewIndex = books[bookIndex].reviews.findIndex((r) => r.username === username);
    books[bookIndex].reviews[userReviewIndex].review = review;
  }

  return res.status(200).json({ message: 'Review added/modified successfully' });
});

module.exports.authenticated = regd_users
