import nconf from 'nconf';

/**
 * Parse configuration data from either environment variables, command line
 * arguments, or a local file.  The local file containing the actual
 * configuration should not be checked into source control.
 */

nconf.env().argv().file('config.json');
   
const config = {
  DISCORD_TOKEN: process.env.DISCORD_SECRET,
  DISCORD_CLIENT_ID: 1286512827053379756,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI: "https://automatic-halibut-x7xj9xw7v5jhrvw-5173.app.github.dev/discord-oauth-callback",
  COOKIE_SECRET: process.env.COOKIE_SECRET
};

export default config;
