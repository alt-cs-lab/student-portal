const logger = require('../configs/logger.js')
const { Model } = require('objection');
const User = require('./user.js');
const Program = require('./program.js');

class UserProgram extends Model {

  static get tableName() {
    return 'user_program';
  }


  static get idColumn() {
    return ['program_id', 'user_id'];
  }

  // Define relations
  static get relationMappings() {
    return {
        program: {
            relation: Model.BelongsToOneRelation,
            modelClass: Program,
            join: {
              from: 'user_program.program_id', // From course_students.course_id
              to: 'programs.id' // To courses.id
            }
          },
    
          // A course student belongs to a user
          user: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
              from: 'user_program.user_id', // From course_students.user_id
              to: 'users.id' // To users.id
            }
          }
    };
  }
}

module.exports = UserProgram;