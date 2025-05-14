const logger = require('../configs/logger.js');
const { Model } = require('objection');
const CourseStudent = require('./courseStudent');
const CourseInstructor = require('./courseInstructor');
const ApplicationCourse = require('./applicationCourse');

//courses need to enter the professional program
const prerequisiteCourses = require('../configs/prerequisiteCourses');

class Course extends Model {
    static get tableName() {
        return 'courses';
    }

    static get idColumn() {
        return 'id';
    }

    static async getAllStudentCourses(id) {
        try {
            const courses = await this.query()
                .join('course_students', 'courses.id', 'course_students.course_id')
                .where('course_students.user_id', id)
                .select(
                    'courses.id',
                    'courses.class_number',
                    'courses.term',
                    'courses.subject',
                    'courses.catalog',
                    'courses.name',
                    'courses.section',
                    'courses.credit_hours',
                    'course_students.grade'
                );
            return courses;
        } catch (err) {
            logger.error('Error fetching user courses:', err);
            throw err;
        }
    }

    static createTermCode(year, month, day) {
        //Take last two of the year, turn them into the second and third of the term code, then put a 2 on the front
        let termCode = ((year % 100) * 10) + 2000
        //Add on the last digit for the semester
        //If course starts from December to April
        if (month == 12 || month <= 4) {
            //Spring
            termCode += 2
        }
        //If course starts on or after September (since December is already covered)
        else if (month >= 9) {
            //Fall
            termCode += 5
        }
        //If course starts in August
        else if (month == 8) {
            //Then we have to see whether it's fall or summer intersession
            //If before the 15th
            if (day <= 15) {
                //Summer
                termCode += 4
            } else {
                //Fall
                termCode += 5
            }
        }
        //Otherwise, it's during summer
        else {
            termCode += 4
        }

        return termCode
    }

    static async find(courseNumber, termCode) {
        const courseCode = courseNumber.split('-')
        const course = await Course.query().where('class_number', courseCode[1]).where('subject', courseCode[0]).where('term', termCode).limit(1)
        if (course.length === 0) {
            return undefined
        }
        return course[0]
    }

    static async create(courseName, courseNumber, sectionName, creditHours, termCode) {
        const courseCode = courseNumber.split('-')
        const course = await Course.query().insert({
            name: courseName,
            class_number: courseCode[1],
            subject: courseCode[0],
            catalog: courseCode[1],
            section: sectionName,
            credit_hours: creditHours,
            term: termCode
        }).onConflict().ignore();
        return course[0]
    }

    static isPrerequisiteCourse(course) {
        return prerequisiteCourses.some(prereq =>
            prereq.class_number === course.class_number && prereq.subject === course.subject
        );
    }

    static addCourseToResults(course, combinedCourses, enrolled) {
        const existingCourse = combinedCourses.find(c =>
            c.class_number === course.class_number && c.subject === course.subject
        );

        if (!existingCourse) {
            combinedCourses.push({
                class_number: course.class_number,
                subject: course.subject,
                grade: course.grade || "N/A",  // Default to "N/A" if no grade exists
                course_status: course.course_status || (course.grade ? "Completed" : (enrolled ? "In-Progress" : "Not Started")),
                waiver: course.waiver || false, // Default waiver
            });
        } else {
            // Only update the waiver field if course already exists
            existingCourse.waiver = course.waiver || existingCourse.waiver || false;
        }
    }

    static addMissingPrerequisiteCourses(combinedCourses) {
        for (const prereq of prerequisiteCourses) {
            const match = combinedCourses.find(c =>
                c.class_number === prereq.class_number &&
                c.subject === prereq.subject
            );

            if (!match) {
                // If the course is not found in the combined results, insert as a default
                combinedCourses.push({
                    class_number: prereq.class_number,
                    subject: prereq.subject,
                    grade: "N/A", // Default to "N/A" grade
                    course_status: "Not Started", // Default status
                    waiver: false, // Default waiver value
                });
            }
        }
    }

    // Main function to get application courses
    static async getApplicationCourses(user_id) {
        try {
            user_id = parseInt(user_id, 10);
            const results = [];

            //Pull all real enrolled courses.
            const enrolledCourses = await this.query()
                .join('course_students', 'courses.id', 'course_students.course_id')
                .where('course_students.user_id', user_id)
                .select(
                    'courses.class_number',
                    'courses.subject',
                    'course_students.grade'
                );
            //Add to the results
            enrolledCourses.forEach(course => {
                if (this.isPrerequisiteCourse(course)) {
                    this.addCourseToResults(course, results, true);
                }
            });

            //Pull all application course data
            const appCourses = await ApplicationCourse.get(user_id)
            appCourses.forEach(course => {
                if (this.isPrerequisiteCourse(course)) {
                    this.addCourseToResults(course, results, false);
                }
            });

            this.addMissingPrerequisiteCourses(results);

            ApplicationCourse.update(user_id, results);

            return results;
            
        } catch (err) {
            logger.error('Error fetching application courses:', err);
            throw err;
        }
    }


    static get relationMappings() {
        return {
            course_students: {
                relation: Model.HasManyRelation,
                modelClass: CourseStudent,
                join: {
                    from: 'courses.id',
                    to: 'course_students.course_id'
                }
            },

            course_instructors: {
                relation: Model.HasManyRelation,
                modelClass: CourseInstructor,
                join: {
                    from: 'courses.id',
                    to: 'course_instructors.course_id'
                }
            },
        };
    }
}

module.exports = Course;
