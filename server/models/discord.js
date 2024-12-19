const Model = require('./base.js')
//const crypto = require('crypto')

class discord extends Model {
  static async runDiscordBot() {
    const { Client, GatewayIntentBits, Guild } = require('discord.js');
    const client = new Client({ intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
    ] });
    let ourServerguild;
    let role;
    const uniqueId = crypto.randomUUID();
    //console.log("nexline");
    //console.log(uniqueId);
    client.login(process.env.DISCORD_SECRET);
    client.once('ready',async () => {
      console.log('Bot is online!');
      ourServerguild = client.guilds.cache.get('1285994775282978900'); // the server id
      if (!ourServerguild) {
        console.error('Guild not found!');
        return;
      }
      role = ourServerguild.roles.cache.get('1308820949310902282'); //the role id
      if (!role) {
        console.error('Role not found!');
        return;
      }
    });
    client.on('guildMemberAdd', async (member) => { 
      if (!member) {
        console.error('Member not found!');
        return;
      }
      const welcomeChannel = member.guild.channels.cache.get('1306295646248239134');//channel id for welcome
      if (welcomeChannel) {
        welcomeChannel.send(`Welcome to the server, ${member.user.tag}! 🎉`);
      }
      try{
        await member.roles.add(role);
        console.log(`Role added from member: ${member.user.tag}`);

      }catch (error){
        console.error('Error adding role:', error);
      }
    });
  }
}
module.exports = discord