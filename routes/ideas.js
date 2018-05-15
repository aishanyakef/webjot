const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Idea Model
require('../models/Idea.js');
const Idea = mongoose.model('ideas');

router.get('/', (req, res) => {
   Idea.find({})
      .sort({date: 'desc'})
      .then(ideas => {
         res.render('ideas/index', {
            ideas: ideas
         })
      })
});

// Add Idea Route
router.get('/add', (req, res) => {
   res.render('ideas/add');
});

// Edit Idea Route
router.get('/edit/:id', (req, res) => {
   Idea.findOne({
      _id: req.params.id
   })
      .then(idea => {
         res.render('ideas/edit', {
            idea: idea
         })
      })
});

// Add an idea by processing the form
router.post('/', (req, res) => {
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
      };
      new Idea (newIdea)
         .save()
         .then(idea => {
            res.redirect('./ideas');
         })
   }

});

// Edit an Idea
router.put('/:id', (req, res) => {
   Idea.findOne({
      _id: req.params.id
   })
      .then(idea => {
         // New Values
         idea.title = req.body.title;
         idea.details = req.body.details;

         idea.save()
            .then(idea => {
               req.flash('success_msg', 'Video Idea updated');
               res.redirect('/ideas');
            })
      })
});

// Delete an Idea
router.delete('/:id', (req, res) => {
   Idea.remove({_id: req.params.id})
      .then(() => {
         res.flash('success_msg', 'Video idea removed');
         res.render('/ideas');
      })
});

module.exports = router;
