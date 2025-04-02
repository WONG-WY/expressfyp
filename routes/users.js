var express = require('express')
var router = express.Router()
var User = require('../models/User');
const { connectToDB } = require('../util/db')

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
  const { name, email, password } = req.body
  try {
    const db = await connectToDB();
    const usersCollection = db.collection('user');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = { name, email, password };
    await usersCollection.insertOne(newUser);

    res.status(200).json({ message: 'Registration successful' });

    // User.findOne({ email }).then(user => {
    //   if (user) {
    //     console.log('Already been registered')
    //     return res.status(400).json({ message: 'Email already registered' });

    // res.render('register', {
    //   name,
    //   email,
    //   password
    // })
    // } else {
    //   return User.create({
    //     name,
    //     email,
    //     password
    //   })
    //.then(() => res.redirect('/users/login'))
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

  //(err => console.log(err))
  //})
});

//send token to frontend
router.post('/login', (req, res) => {
  //res.render('login')
})

module.exports = router
