const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');

const app = express();

// Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

const db = require('./config/database');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(db.mongoURI)
   .then(() => console.log('MongoDB Connected...'))
   .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({
   defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Method Override Middleware
app.use(methodOverride('_method'));

// Express Session Middleware
app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());



// Global Variables
app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg');
   res.locals.error_msg = req.flash('error_msg');
   res.locals.error = req.flash('error');
   next();

});

// Index Route
app.get('/', (req, res) => {
   res.render('index');
});

// About Route
app.get('/about', (req, res) => {
   res.render('about');
});

app.use('/ideas', ideas);
app.use('/users', users);

const port = 5000;

app.listen(port, () => {
   console.log(`Server started on port ${port}`);
});