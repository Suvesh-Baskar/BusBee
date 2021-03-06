const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load Routes
const tickets = require('./routes/tickets');
const users = require('./routes/users');
const admin = require('./routes/admin');

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/database');

// Map Global Promise - to get rid of mpromise deprecation warning
mongoose.Promise = global.Promise;

// Connect to Mongoose
mongoose
  .connect(db.mongoURI, {
    useNewUrlParser: true
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine(
  'handlebars',
  exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Express Session Middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global Variables
app.use(function(req, res, next) {
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Static Folder for assets
app.use(express.static(path.join(__dirname, 'public')));

// Index Route
app.get('/', (req, res) => {
  res.render('index');
});

// Static Folder for assets
app.use('/users', express.static(path.join(__dirname, 'public')));

// Use Route
app.use('/users', users);

// Static Folder for assets
app.use('/tickets', express.static(path.join(__dirname, 'public')));

// Use Route
app.use('/tickets', tickets);

// Static Folder for assets
app.use('/admin', express.static(path.join(__dirname, 'public')));

// Use Route
app.use('/admin', admin);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
