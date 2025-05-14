/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: API to move information around with the applications. Mix of user and admin level
 *   base-file-route: api/v1/protected/applications/
 */

const express = require('express');
const router = express.Router();
const reviewerOnly = require('../middleware/reviewerRequired.js')

//Models
const Application = require('../models/application.js');
const ApplicationCourse = require('../models/applicationCourse')
const User = require('../models/user.js');
const Course = require('../models/course.js');

/*
 * API routes for handling professional program applications
 * Base api route: "api/applications/" 
 */

//Route to get the list of applications
router.get('/', reviewerOnly, async (req, res) => {
  try {
    const applications = await Application.getAllApplications();
    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).send('Server error');
  }
});

router.get('/courses', reviewerOnly, async (req, res) => {
  try {
    let courses = await Course.getApplicationCourses(req.query.app_user_id)
    res.json(courses)
  } catch (err) {
    console.error('Error retieving user application details:', err);
    res.status(500).send('Server error');
  }
});

router.get('/self', async (req, res) => {
    try {
      let courses = await Course.getApplicationCourses(req.user_id)
      let application = await Application.find(req.user_id);
      res.json({ courses, application })
    } catch (err) {
      console.error('Error retieving user application details:', err);
      res.status(500).send('Server error');
    }
})

//Route for a user to submit their application
router.post('/submit', async (req, res) => {
  try {
    Application.create(req.user_id, req.body.application);
    ApplicationCourse.update(req.user_id, req.body.courses);
    res.status(200).send('Application submitted successfully');
  } catch (err) {
    console.error('Error creating application:', err);
    res.status(500).send('Server error');
  }
  
})

module.exports = router;
