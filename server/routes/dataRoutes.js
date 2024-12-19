const express = require('express');
const adminOnly = require('../middleware/admin-required');
const router = express.Router();

//Honestly not sure what this is, I assume it's a testing/debug route
router.get('/GETEVERYTHING', adminOnly, async (req, res) => {
    const knex = req.app.get('knex')
    try {
        const data = await knex.select('*').from('dars_data');
        console.log(data);
        res.json(data);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Server error');
    }
});
 
module.exports = router;
