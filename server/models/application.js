const Model = require('./base.js')
const logger = require('../configs/logger.js')
const objection = require('objection')
const Course = require('./course');

//Related Roles
const User = require('./user.js')

//Model class for submitted professional program applications (PPAs)
class Application extends Model {
    //The table in the migration this Model refers to
    static get tableName() {
        return 'professional_program_applications'
    }

    //Default, defined for clarity
    static get idColumn() {
        return 'id'
      }

    //Method to find application
    static async find(user_id) {
        let application = await Application.query().where('user_id', user_id).limit(1)

        if(application.length === 0) {
            return null
        }
        //If found, return application
        return application[0]
    }

    static async getAllApplications() {
      const applications = await this.query()
        .withGraphFetched('user')
        .modifyGraph('user', builder => {
          builder.select('id', 'first_name', 'last_name', 'email', 'eid', 'wid');
        })
        .select(
          'id',
          'user_id',
          'advisor',
          'semester',
          'status',
          'notes',
          'created_by',
          'updated_by'
        );
    
      return applications;
    }

    static async create(user_id, application) {
      const existing = await this.query().findOne({ user_id });
    
      if (existing) {
        // Update existing application
        return await this.query().patchAndFetchById(existing.id, {
          advisor: application.advisor,
          semester: "Spring 2025",
          status: "Pending",
          notes: application.notes || null,
          updated_by: user_id,
        });
      } else {
        // Insert new application
        return await this.query().insert({
          user_id,
          advisor: application.advisor,
          semester: "Spring 2025",
          status: "Pending",
          notes: application.notes || null,
          created_by: user_id,
          updated_by: user_id,
        });
      }
    }

    static get relationMappings() {
        return {
          user: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            join: {
              from: 'professional_program_applications.user_id',
              to: 'users.id',
            },
            filter: (builder) => builder.select('id'),
          },
        }
    }
}

module.exports = Application