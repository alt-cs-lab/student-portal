const logger = require('../configs/logger.js')
const { Model } = require('objection');
const User = require('./user.js');

class AcademicStatus extends Model {

  static get tableName() {
    return 'academic_status';
  }


  static get idColumn() {
    return ['user_id'];
  }

  // Define relations
  static get relationMappings() {
    return {
        academic_status: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            from: 'academic_status.user_id',
            to: 'users.id'
        }
  };
}
}
module.exports = AcademicStatus;