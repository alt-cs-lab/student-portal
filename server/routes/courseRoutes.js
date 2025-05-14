//Load Libraries
express = require('express');
const router = express.Router();
const Course = require('../models/course.js');

router.get('/self', async (req, res) => {  
    try{
        const id = req.user_id;
        const response = await Course.getAllStudentCourses(id);
        res.json(response);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).send('Server error');
    }  
});

router.get('/:id', async (req, res) => {  
    try{
        const { id } = req.params;
        const response = await Course.getAllStudentCourses(id);
        res.json(response);
    } catch (err) {
        console.error('Error fetching courses:', err);
        res.status(500).send('Server error');
    }  
});

function getNthWeekdayFallSummer(year, month, weekday, n) {    
    let date = new Date(year, month - 1, 1); 
    let count = 0; 
    
    if (date.getDay() > weekday) {
      count++;
    }
    while (date.getDay() !== weekday) {
        date.setDate(date.getDate() + 1);
    }
    while (true) {
        count++;
        if (count === n) {
            return date.getDate();
        }
        date.setDate(date.getDate() + 7); 
    }
}

function getNthWeekday(year, month, weekday, n) {
    let count = 0;
    let date = new Date(year, month - 1, 1);
    while (true) {
        if (date.getDay() === weekday) {
            count++;
            if (count === n) {
                return date.getDate();
            }
        }
        date.setDate(date.getDate() + 1);
    }
}

function determineSemester(dateInput) {
    const date = new Date(dateInput + 'Z');
	console.log("Current Date1: " + date); 
    const year = date.getFullYear();
    const fallStart = new Date(year, 7, getNthWeekdayFallSummer(year, 8, 1, 4));  
    const springStart = new Date(year, 0, getNthWeekday(year, 1, 2, 3)); 
    const summerStart = new Date(year, 4, getNthWeekdayFallSummer(year, 5, 1, 4));  
    const nextSpringStart = new Date(year + 1, 1, getNthWeekday(year + 1, 1, 2, 3)); 

    if ((date >= fallStart || date < springStart) && date < nextSpringStart) { 
        return 'Fall ' + year;
    }
    if (date >= springStart && date < summerStart) { 
        return 'Spring ' + year;
    }
    if (date >= summerStart && date < fallStart) { 
        return 'Summer ' + year;
    }  
    return "Date does not fall within the academic calendar year."; // Default return for out of range dates. should not hit. 
}
 
module.exports = router;
