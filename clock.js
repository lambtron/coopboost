
/**
 * Module dependencies.
 */

const CronJob = require('cron').CronJob
const bot = require('./lib/bot')
const co = require('co')

/**
 * Initiate Cronjob.
 */

new CronJob({
  cronTime: "00 30 11 * * 1-5",
  onTick: co(bot()),
  start: true,
  timeZone: "America/Los_Angeles"
});
