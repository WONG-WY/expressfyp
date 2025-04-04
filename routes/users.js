require('dotenv').config()
var express = require('express')
var router = express.Router()
var User = require('../models/User');
const { connectToDB } = require('../util/db')
const bcrypt = require('bcrypt');
const axios = require('axios');


//get login info from frontend
router.get('/login', (req, res) => {
  const { email, password } = req.body;
  res.send('Login endpoint hit');
  //res.render('login')
})

//get register info from frontend
// router.get('/register', (req, res) => {
//   const { email, password } = req.body;
//   res.render('register')
// })

router.post("/register", async (req, res) => {
  console.log(">>>get data as post")
  console.log(process.env.MONGODB_URI)
  const { name, email, password } = req.body
  try {
    const db = await connectToDB();
    const usersCollection = db.collection('user');
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { name, email, password: hashedPassword };
    await usersCollection.insertOne(newUser);

    res.status(200).json({ message: 'Registration successful' });

  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

  //(err => console.log(err))
  //})
});

router.post('/login', async (req, res) => {
  console.log("/login get data successfully")
  console.log(process.env.AUTH0_DOMAIN);
  const { email, password } = req.body;
  const trimmedEmail = email.trim().toLowerCase();

  try {
    const db = await connectToDB();
    const usersCollection = db.collection('user');

    // Find the user by email
    const user = await usersCollection.findOne({ email: trimmedEmail });
    console.log("User object:", user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }
    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Wrong password!' });
    }
    // after successful database authentication
    try {
      const auth0Options = {
        method: 'post',
        //url: "https://${process.env.AUTH0_DOMAIN}/oauth/token", //jwt created here
        baseURL: "https://" + process.env.AUTH0_DOMAIN,
        url: '/oauth/token',
        headers: { 'content-type': 'application/json' },
        data: {
          grant_type: 'password',
          username: email,
          password: password,
          audience: process.env.AUTH0_API_IDENTIFIER,
          client_id: process.env.AUTH0_CLIENTID,
          client_secret: process.env.AUTH0_CLIENTSECRET,
        },
      };

      const response = await axios(auth0Options);
      const accessToken = response.data.access_token;
      res.status(200).json({ token: accessToken }); // Send the Auth0 token

    } catch (error) {
      console.error("Auth0 Authentication Error:", error);
      res.status(500).json({ message: 'Authentication failed' });
    }
    console.log("auth0 finish");

    // Generate JWT token
    // const token = jwt.sign({ id: user._id, email: user.email }, process.env.GENERALUSER_JWT_SECRET, {
    //   expiresIn: '1h' // Set expiration time as desired
    // });

    // Send the token back to the client
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/users/login')
})

module.exports = router
