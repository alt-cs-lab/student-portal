/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Clear existing entries
  await knex('user_courses').del();
  await knex('professional_program_applications').del();
  await knex('user_roles').del();
  await knex('roles').del();
  await knex('user_program').del();
  await knex('programs').del();
  await knex('users').del();

  // Insert roles
  await knex('roles').insert([
    { id: 1, name: 'api' },
    { id: 2, name: 'admin' }
  ]);

  // Insert users
  await knex('users').insert([
    {
      wid: 101,
      eid: 'E101',
      first_name: 'Josh',
      last_name: 'Riddle',
      email: 'jariddle@ksu.edu',
      refresh_token: null,
      is_admin: false,
      advisor: false,
      warning: false,
      profile_updated: true,
      updated_at: '2024-11-01 10:00:00',
      updated_by: 'system'
    },
    {
      wid: 102,
      eid: 'E102',
      first_name: 'Ethan',
      last_name: 'Jones',
      email: 'ejones77@ksu.edu',
      refresh_token: null,
      is_admin: false,
      advisor: false,
      warning: false,
      profile_updated: true,
      updated_at: '2024-11-01 11:00:00',
      updated_by: 'system'
    },
    {
      wid: 103,
      eid: 'E103',
      first_name: 'Alice',
      last_name: 'Johnson',
      email: 'alicejohnson@ksu.edu',
      refresh_token: null,
      is_admin: false,
      advisor: false,
      warning: false,
      profile_updated: true,
      updated_at: '2024-11-01 12:00:00',
      updated_by: 'system'
    },
    {
      wid: 104,
      eid: 'E104',
      first_name: 'admin',
      last_name: 'admin',
      email: 'admin@ksu.edu',
      refresh_token: null,
      is_admin: true,
      advisor: false,
      warning: false,
      profile_updated: true,
      updated_at: '2024-11-01 10:00:00',
      updated_by: 'system'
    },
    {
      wid: 105,
      eid: 'E105',
      first_name: 'user',
      last_name: 'user',
      email: 'user@ksu.edu',
      refresh_token: null,
      is_admin: false,
      advisor: false,
      warning: false,
      profile_updated: true,
      updated_at: '2024-11-01 10:00:00',
      updated_by: 'system'
    },
  ]);

  await knex('user_courses').insert([
    {
      user_id: 1, // John Doe
      class_number: 101,
      term: 202401,
      subject: 'MATH',
      catalog: '101',
      name: 'Calculus I',
      component: 'LEC', 
      grade: 'A',
      ignore_in_gpa: false,
    },
    {
      user_id: 2, // Jane Smith
      class_number: 102,
      term: 202403, 
      subject: 'PHYS',
      catalog: '201',
      name: 'Physics I',
      component: 'LEC',
      grade: 'B',
      ignore_in_gpa: false,
    },
    {
      user_id: 3, // Alice Johnson
      class_number: 103,
      term: 202402,
      subject: 'CS',
      catalog: '120',
      name: 'Introduction to Programming',
      component: 'LEC',
      grade: 'A',
      ignore_in_gpa: false,
    },
    {
      user_id: 5, // user user
      class_number: 104,
      term: 202401,
      subject: 'ENGL',
      catalog: '110',
      name: 'College Writing',
      component: 'LEC',
      grade: 'C',
      ignore_in_gpa: false,
    },
  ]);

  await knex('professional_program_applications').insert([
    {
      user_id: 1, // John Doe
      semester: '2024 Spring',
      status: 'Pending',
      notes: 'Looking to apply for the Math program',
      waiver: false,
      created_by: 'system',
      updated_by: 'system',
    },
    {
      user_id: 2, // Jane Smith
      semester: '2024 Fall',
      status: 'Submitted',
      notes: 'Physics program application submitted',
      waiver: true, // Waiver granted
      created_by: 'system',
      updated_by: 'system',
    },
    {
      user_id: 3, // Alice Johnson
      semester: '2024 Summer',
      status: 'Approved',
      notes: 'Accepted into the Computer Science program',
      waiver: false,
      created_by: 'system',
      updated_by: 'system',
    },
    {
      user_id: 5, // user user
      semester: '2024 Spring',
      status: 'Pending',
      notes: 'Waiting for approval in the English program',
      waiver: false,
      created_by: 'system',
      updated_by: 'system',
    },
  ]);

  // Assign roles to users
  await knex('user_roles').insert([
    { user_id: 1, role_id: 1 }, 
    { user_id: 2, role_id: 1 },
    { user_id: 3, role_id: 1 },
    { user_id: 4, role_id: 2 },
  ]);
};
