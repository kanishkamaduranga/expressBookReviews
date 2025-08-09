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
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
