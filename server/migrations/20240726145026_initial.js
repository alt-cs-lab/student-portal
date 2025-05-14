/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    .createTable('users', function(table) {
      table.increments('id');
      table.integer('wid').unique().notNullable();
      table.string('eid', 20).unique().notNullable();
      table.string('first_name');
      table.string('last_name');
      table.string('email').unique().notNullable();
      table.string('refresh_token', 255);
      table.boolean('profile_updated').defaultTo(false);
      table.timestamp('updated_at').nullable();
      table.string('updated_by').nullable();
    })
    .createTable('academic_status', function(table) {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').primary();
      table.decimal('gpa', 3, 2).nullable();
      table.boolean('warning').notNullable().defaultTo(false);
      table.boolean('probation').notNullable().defaultTo(false);
    })
    .createTable('user_discord', function(table) {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').primary();
      table.string('discord_id').notNullable();
      table.string('username', 255).notNullable();
    })
    .createTable('user_github', function(table) {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE').primary();
      table.string('github_id').notNullable();
      table.string('username', 255).notNullable();
      table.string('profile_url', 255).notNullable();
    })
    .createTable('programs', function(table) {
      table.increments('id');
      table.string('name').notNullable();
      table.string('plan').notNullable();
      table.string('subplan');
      table.unique(['name', 'plan'])
    })
    .createTable('user_program', function(table) {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('program_id').unsigned().references('id').inTable('programs');
      table.primary(['user_id','program_id']);
      table.string('assigned_advisor');
      table.boolean('graduated');
      table.boolean('withdrew');
      table.boolean('dismissed');
      table.float('program_gpa');
      table.string('classification');
      table.string('graduation_date');
      table.boolean('on_warning');
    })
    .createTable('roles', function(table) {
      table.increments('id');
      table.string('name').unique().notNullable();
    })
    .createTable('user_roles', function(table) {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
      table.primary(['user_id','role_id']);
    })
    .createTable('professional_program_applications', function(table) {
      table.increments('id');
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.string('advisor').notNullable();
      table.string('semester').notNullable();
      table.string('status').notNullable();
      table.string('notes').defaultTo("");
      table.timestamps();
      table.string('created_by', 20);
      table.string('updated_by', 20);
    })
    .createTable('courses', function(table){
      table.increments('id');
      table.integer('class_number').notNullable();
      table.integer('term').notNullable();
      table.string('subject').notNullable();
      table.string('catalog').notNullable();
      table.string('name').notNullable();
      table.string('section').notNullable();
      table.integer('credit_hours');
    })
    .createTable('course_students', function(table) {
      table.integer('course_id').unsigned().references('id').inTable('courses').onDelete('CASCADE');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.primary(['course_id','user_id']);
      table.string('grade').nullable();
      table.boolean('ignore_in_gpa').defaultTo(false);
      table.boolean('dropped').defaultTo(false);
      table.string('dropped_date');
      table.string('last_attendance');
      table.string('midterm_grade');
    })
    .createTable('course_instructors', function(table) {
      table.integer('course_id').unsigned().references('id').inTable('courses').onDelete('CASCADE');
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.primary(['course_id','user_id']);
    })
    .createTable('application_courses', function(table) {
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('subject').notNullable();
      table.integer('class_number').notNullable();
      table.string('course_status').defaultTo("Not Started");
      table.boolean('waiver').defaultTo(false);
      table.unique(['user_id', 'subject', 'class_number']);
    });    
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable('application_courses')
    .dropTable('course_instructors')
    .dropTable('course_students')
    .dropTable('courses')
    .dropTable('professional_program_applications')
    .dropTable('user_roles')
    .dropTable('roles')
    .dropTable('user_program')
    .dropTable('programs')
    .dropTable('academic_status')
    .dropTable('user_discord')
    .dropTable('user_github')
    .dropTable('users');
};
