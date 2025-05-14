const Model = require('../models/base.js');
const User = require('../models/discordmodel.js');
const { Client, GatewayIntentBits } = require('discord.js');
//the discord role ids that match the CIS courses
const roles = require('../configs/discordRoleIDs.js')

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

const discordModelTest = new User();
//The server the bot is in. 
let ourServerguild;

let all_students;

client.login(process.env.DISCORD_SECRET).catch((error) => {
  console.log("Discord secret not found in GitHub Secrets. Refer to the Discord Integration section of the README.");
});
client.once('ready', async () => {
  
  console.log('Bot is online!');
  ourServerguild = await client.guilds.cache.get(process.env.DISCORD_SERVER_ID);
  if (!ourServerguild) {
    console.error('Guild not found!');
    return;
  }
  all_students = await discordModelTest.get_users_with_discord(); // Querys the database and collects all students with a discord_id that is not null
});
// Converts the queried objects into the assigned roles. 
function matchClassesToRoles(listOfCourses) {
  let convertedCourses = [];
  for (let i = 0; i < listOfCourses.length; i++) {
    if (listOfCourses[i].catalog.includes(115)) convertedCourses.push(roles[0]);
    if (listOfCourses[i].catalog.includes(200)) convertedCourses.push(roles[1]);
    if (listOfCourses[i].catalog.includes(300)) convertedCourses.push(roles[2]);
    // Put more courses here as needed
  }
  return convertedCourses;
}
// Called from admin page. resets all CIS related discord roles. 
async function handleAllStudentRoles() {
  for (let x = 0; x < all_students.length; x++) {  // For every student with a valid discord 
    let student_courses = await discordModelTest.get_student_courses(all_students[x].discord_id); // Get all CIS related courses
    let student_roles = matchClassesToRoles(student_courses); // Then get all of the matching discord roles from said courses
    const member = await ourServerguild.members.fetch(all_students[x].discord_id).catch(() => null); // Get the discord of the user itself
    if (!member) {
      console.error('Student not found');
    } else {
      try {
        const rolesToRemove = member.roles.cache.filter(role => roles.includes(role.id)); // Remove all previous CIS roles
        if (rolesToRemove.size > 0) await member.roles.remove(rolesToRemove);
        for (let y = 0; y < student_roles.length; y++) { // Assign all new CIS roles
          const role = ourServerguild.roles.cache.get(student_roles[y]);
          await member.roles.add(role);
        }
      } catch (error) {
        console.error('Error adding role:', error);
      }
    }
  }
}
// Called from admin page. Resets 1 students CIS discord roles. Same as handleAllStudent but without the loop
async function handleSelectStudentRoles(studentDiscordID) {
  let student_courses = await discordModelTest.get_student_courses(studentDiscordID); //get all CIS related courses
  let student_roles = matchClassesToRoles(student_courses); // Then get all of the matching discord roles from said courses
  const member = await ourServerguild.members.fetch(studentDiscordID).catch(() => null);  // Get the discord of the user itself
  if (!member) {
    console.error('Student not found');
    return false;
  } else {
    try {
      const rolesToRemove = member.roles.cache.filter(role => roles.includes(role.id)); // Remove all previous CIS roles
      if (rolesToRemove.size > 0) await member.roles.remove(rolesToRemove);
      for (let y = 0; y < student_roles.length; y++) { // Assign all new CIS roles
        const role = ourServerguild.roles.cache.get(student_roles[y]);
        await member.roles.add(role);
      }
    } catch (error) {
      console.error('Error adding role:', error);
      return false;
    }
  }
}
// Automatically runs whenever a user joins the discord
client.on('guildMemberAdd', async (member) => {
  if (!member) {
    console.error('Member not found!');
    return;
  }
  // Code below will fail if welcome channle is not created. 
  // Does not need to be titled welcome and honistly isnt required. 
  const welcomeChannel = member.guild.channels.cache.get(process.env.DISCORD_WELCOME_CHANNEL);
  if (welcomeChannel) {
    welcomeChannel.send(`Welcome to the server, ${member.user.tag}! 🎉`); 
  }
  try {
    await member.roles.add(roles[0]); // Automatically gives new members role for testing 
    console.log(`Roles added for member: ${member.user.tag}`);
  } catch (error) {
    console.error('Error adding role:', error);
  }
});
module.exports = {
  handleSelectStudentRoles,
  handleAllStudentRoles
};