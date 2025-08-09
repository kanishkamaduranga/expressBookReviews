const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username) => {

  let userWithName = users.filter((user) => {
    return user.username === username;
  });

  if(userWithName.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  
  const { username, password} = req.body;

  if(username && password ) {

    if(!doesExist(username)){
      users.push({"username" : username, "password" : password});
        return res.status(200).json({message: "User successfully registed."});
    } else {
      return res.status(404).json({message: "Unable to register user.!"});
    };
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

    new Promise((resolve, reject) => {

        process.nextTick(() => {
            resolve(books);
        })
    }).then(bookList => {
        return res.status(200).json(books);
    })
    .catch(error => {
        return res.status(500).json({message: "Error fetching books" , error: error});
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    
    const isbn = req.params.isbn;
    if(!isbn) {
        return res.status(400).json({message: "ISBN is required in URL"});
    }

    new Promise((resolve, reject) => {

        process.nextTick(() => {
            
            if(books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject( new Error("Book not found "))
            }
        });
    }). then (book => {
        return res.status(200).json(books[isbn]);
    }). catch (error => {
        return res.status(404).json({message: error.message});
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

  const authorName = req.params.author; 
  
    if (!authorName) {
        return res.status(400).json({ message: "Author name is required in URL" });
    }

    new Promise((resolve, reject) => {

        process.nextTick(() => {

            let autherbooks = Object.values(books).filter(
              book => book.author.trim() === authorName
            );

            if (autherbooks.length > 0) {
                resolve(autherbooks);
            } else {
                reject( new Error("No books found for this author "));
            }
        });

       // return res.status(200).json(authorBooks);
    }).then( autherbooks => {
        return res.status(200).json(autherbooks);
    }).catch (error => {
        return res.status(404).json({message: error.message})
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    
  const title = req.params.title.trim();
  if(!title) {
    return res.status(400).json({message: "Title is required in URL"});
  }

  new Promise((resolve, reject) => {

    process.nextTick(() => {
      let machedBook = Object.values(books).filter(
        book => book.title.toLowerCase().includes(title.toLowerCase())
      );

      if(machedBook.length > 0) {
        resolve(machedBook);
      } else {
        reject(new Error("No books found with this title"));
      }
    });
  }).then ( machedBook => {
    return res.status(200).json(machedBook);
  }) .catch (error => {
    return res.status(404).json({message: error.message});
  });
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(!isbn) {
    return res.status(400).json({message: "ISBN is required in URL"});
  }

  if(books[isbn]){
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "No books found for this isbn"});
  }
});

module.exports.general = public_users;
