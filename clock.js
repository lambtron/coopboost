
/**
 * Module dependencies.
 */

var CronJob = require('cron').CronJob;
var bot = require('./lib/bot');
var co = require('co');

/**
 * Initiate Cronjob.
 */

new CronJob({
  cronTime: "00 30 11 * * 1-5",
  onTick: co(bot()),
  start: true,
  timeZone: "America/Los_Angeles"
});
