import nconf from 'nconf';

/**
 * Parse configuration data from either environment variables, command line
 * arguments, or a local file.  The local file containing the actual
 * configuration should not be checked into source control.
 */

nconf.env().argv().file('config.json');

const config = {
  DISCORD_TOKEN: 'process.env.DISCORD_SECRET',
  DISCORD_CLIENT_ID: 'process.env.DISCORD_CLIENT_ID',
  DISCORD_CLIENT_SECRET: 'process.env.DISCORD_CLIENT_SECRET',
  DISCORD_REDIRECT_URI: '${process.env.GITHUB_CODESPACE_URL}/discord-oauth-callback', //Must be updated in developer portal
  COOKIE_SECRET: 'process.env.COOKIE_SECRET',
};
export default config;
