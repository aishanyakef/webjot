const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const db = require('./config/database');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
mongoose.connect(db.mongoURI)
   .then(() => console.log('MongoDB Connected...'))
   .catch(err => console.log(err));

// Load Idea Model
require('./models/Idea.js');
const Idea = mongoose.model('ideas');


// Handlebars Middleware
app.engine('handlebars', exphbs({
   defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Index Route
app.get('/', (req, res) => {
   res.render('index');
});

// About Route
app.get('/about', (req, res) => {
   res.render('about');
});

// Add Idea Route
app.get('/ideas/add', (req, res) => {
   res.render('ideas/add');
});

// Add an idea by processing the form
app.post('/ideas', (req, res) => {
   let errors = [];

   if (!req.body.title) {
      errors.push({text: 'Please add a title'});
   }
   if (!req.body.details) {
      errors.push({text: 'Please add some details'});
   }

   if (errors.length > 0) {
      res.render('ideas/add', {
         errors: errors,
         title: req.body.title,
         details: req.body.details
      })
   } else {
      const newIdea = {
         title: req.body.title,
         details: req.body.details
      }
      new Idea (newIdea)
         .save()
         .then(idea => {
            res.redirect('./ideas');
         })
   }

   });


const port = 3000;

app.listen(port, () => {
   console.log(`Server started on port ${port}`);
});