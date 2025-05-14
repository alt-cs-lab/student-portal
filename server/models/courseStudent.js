const logger = require('../configs/logger.js')
const { Model } = require('objection');
const User = require('./user');
const Course = require('./course');

class CourseStudent extends Model {

  static get tableName() {
    return 'course_students';
  }


  static get idColumn() {
    return ['course_id', 'user_id'];
  }

  // Define relations
  static get relationMappings() {
    return {
      // A course student belongs to a course
      course: {
        relation: Model.BelongsToOneRelation,
        modelClass: Course,
        join: {
          from: 'course_students.course_id', // From course_students.course_id
          to: 'courses.id' // To courses.id
        }
      },

      // A course student belongs to a user
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'course_students.user_id', // From course_students.user_id
          to: 'users.id' // To users.id
        }
      }
    };
  }
}

module.exports = CourseStudent;
