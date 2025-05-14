const logger = require('../configs/logger.js')
const { Model } = require('objection');
const User = require('./user'); 
const Course = require('./course'); 

class CourseInstructor extends Model {

  static get tableName() {
    return 'course_instructors';
  }

  // Define the primary key columns (composite key)
  static get idColumn() {
    return ['course_id', 'user_id'];
  }

  // Define relations
  static get relationMappings() {
    return {
      // A course instructor belongs to a course
      course: {
        relation: Model.BelongsToOneRelation,
        modelClass: Course,
        join: {
          from: 'course_instructors.course_id',
          to: 'courses.id'
        }
      },

      // A course instructor belongs to a user
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'course_instructors.user_id',
          to: 'users.id'
        }
      }
    };
  }
}

module.exports = CourseInstructor;
