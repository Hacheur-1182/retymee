const express = require('express');
var passport = require('passport')
var router = express.Router();


//Login
router.post('/login', function(req, res, next){
	passport.authenticate('local-admin', {
        successRedirect: '/admin/home',
        failureRedirect: '/admin',
        failureFlash: true
	})(req, res, next)
});

//Logout
router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success', 'Vous êtes déconnecté')
    res.redirect('/admin')
});

// Exports
module.exports = router;
