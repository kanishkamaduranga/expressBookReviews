const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){

    const authHeader = req.headers.authorization;
    
    if(!authHeader) return res.status(401).json({message : "Auth token not provided"});
    const token = authHeader.split(' ')[1];

    try{
        jwt.verify(token, "access", (err, user) => {

            if(!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({ message: "Customer not authenticated"});
            }
        });
    } catch (err) {
        return res.status(403).json({messge: "Customer not logged in"});
    }
});
 
const PORT =5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
