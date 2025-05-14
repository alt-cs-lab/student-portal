const logger = require('../configs/logger.js')
const { Model } = require('objection');
const User = require('./user');
const UserProgram = require('./userProgram.js')

class Program extends Model {

  static get tableName() {
    return 'programs';
  }


  static get idColumn() {
    return 'id';
  }

  static async findOrCreate(name, plan) {
    let program = await Program.query().where('name', name).where('plan', plan).limit(1)
    if (program.length === 0) {
        program = [
            await Program.query().insert({
                name: name,
                plan: plan,
            }).onConflict().ignore()
        ]
    }

    return program[0]
  }

  // Define relations
  static get relationMappings() {
    return {
        user_program: {
            relation: Model.ManyToManyRelation,
            modelClass: User,
            join: {
              from: 'programs.id',
              through: {
                modelClass: UserProgram,
                from: 'user_program.program_id',
                to: 'user_program.user_id',
                extra: ['assigned_advisor', 'graduated', 'withdrew', 'dismissed', 'program_gpa', 'classification', 'graduation_date', 'on_warning']
              },
              to: 'users.id'
            }
          },
    };
  }
}

module.exports = Program;