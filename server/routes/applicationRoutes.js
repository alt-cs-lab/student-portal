const express = require('express');
const router = express.Router();
const adminOnly = require('../middleware/admin-required.js')

//Route to get the list of applications
router.get('/applications', adminOnly, async (req, res) => {
  const knex = req.app.get('knex')
  try {
    const applications = await knex('professional_program_applications')
      .join('users', 'professional_program_applications.user_id', '=', 'users.id')
      .select(
        'professional_program_applications.id',
        'professional_program_applications.user_id',
        'users.advisor',
        'professional_program_applications.semester',
        'professional_program_applications.status',
        'professional_program_applications.notes',
        'professional_program_applications.waiver',
        'professional_program_applications.created_by',
        'professional_program_applications.updated_by',
        'users.first_name',
        'users.last_name',
        'users.email',
        'users.eid', 
      );
    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
