const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

require('./config/passport')(passport);
// DB Config
const db = require('./config/keys').mongoURI;

// MongoDB baza
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB povezan'))
  .catch(err => console.log(err));


// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

//express session middleware

app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());
//globalne varijable
app.use(function(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});




//putanje
app.use('/',require('./routes/index'));
app.use('/users', require('./routes/users'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server pokrenut na portu ${PORT}`));