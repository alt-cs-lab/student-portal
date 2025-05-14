const { Model } = require('objection');
const logger = require('../configs/logger.js');

const prerequisiteCourses = require('../configs/prerequisiteCourses');

class ApplicationCourse extends Model {

    static get tableName() {
        return 'application_courses';
    }

    static get idColumn() {
        return ['user_id', 'subject', 'class_number'];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id', 'subject', 'class_number'],

            properties: {
                user_id: { type: 'integer' },
                subject: { type: 'string' },
                class_number: { type: 'integer' },
                course_status: { type: 'string' },
                waiver: { type: 'boolean' }
            }
        };
    }

    static async get(user_id){
        const appCourses = await this.query()
                .where('user_id', user_id)
                .select('class_number', 'subject', 'course_status', 'waiver');
        return appCourses;
    }

    static async insert(userId, subject, classNumber, status = 'Not Started') {
      try {
          await this.query()
              .insert({
                  subject,
                  class_number: classNumber,
                  user_id: userId,
                  course_status: status,
                  waiver: false
              })
              .onConflict(['subject', 'class_number', 'user_id'])
              .ignore();
      } catch (err) {
          logger.error('Error inserting default application course:', err);
          throw err;
      }
  }

  static async update(user_id, courses) {
    try {
        // Filter the courses to include only those found in prerequisiteCourses
        const validCourses = courses.filter(course =>
            prerequisiteCourses.some(prerequisite =>
                prerequisite.class_number === course.class_number && prerequisite.subject === course.subject
            )
        );

        // Process only valid courses
        for (const course of courses) {
            await this.query()
                .insert({
                    user_id,
                    subject: course.subject,
                    class_number: course.class_number,
                    course_status: course.course_status,
                    waiver: course.waiver
                })
                .onConflict(['user_id', 'subject', 'class_number'])
                .merge();
        }
    } catch (err) {
        logger.error('Error updating application courses:', err);
        throw err;
    }
}
}

module.exports = ApplicationCourse;
