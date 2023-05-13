const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
  // authentication middleware
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized access' });
  }
});
 
const PORT =5000;

app.use("/", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
