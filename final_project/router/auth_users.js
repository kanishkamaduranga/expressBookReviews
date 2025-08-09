const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    
    let validuser = users.filter((user) => {
        return (user.username === username);
    })

    if( validuser.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{

    let validuser = users.filter((user) => {
        return (user.username=== username && user.password === password);
    });

    if( validuser.length > 0) {
        return true;
    } else {
        return false;
    }
 }

//only registered users can login
regd_users.post("/login", (req,res) => {
  
    const {username, password} = req.body;

    if(username && password) {

        if(isValid(username)) {

            if(authenticatedUser(username, password)) {

                let accessToken = jwt.sign({
                    data: password
                }, 'access', { expiresIn: 60 *60});

                req.session.authorization = {
                    accessToken, username
                }

                return res.status(200).send("User successfully logged in ");
            }
            return res.status(404).json({message: "Invalid password"});
        }
        return res.status(404).json({message: "Invalid username"});
    }
     return res.status(404).json({message: "Unable to log in."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!isbn ) {
        return res.status(400).json({message: "ISBN is required"});
    }

    if(!review) {
        return res.status(400).json({message: "Review is required"});
    }

    if( !username) {
        return res.status(401).json({message: "User not loggined in"});
    }

    if(!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added succesfuly ",
        book: books[isbn]
    })
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
