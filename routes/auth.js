var express = require('express');
var passport = require('passport');
var jwt = require('jsonwebtoken');

var router = express.Router();

router.get('/callback', passport.authenticate('auth0', { failureRedirect: '/login' }), (req, res) => { //'/api/login'
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;