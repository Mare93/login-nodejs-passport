const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');

router.get('/login', (req,res) => res.render('login'));

router.get('/register', (req,res) => res.render('register'));

// Registacija
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Molimo vas popunite sva polja' });
  }

  if (password != password2) {
    errors.push({ msg: 'Sifre se ne slazu' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Sifra mora da ima bar 6 karaktera' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      
      if (user) {
        errors.push({ msg: 'Korisnik vec postoji' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Registrovali ste se'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', function(req, res, next) {
 
  
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'Izlogovali ste se');
  res.redirect('/users/login');
});

module.exports = router;