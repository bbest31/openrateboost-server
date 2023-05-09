var CronJob = require('cron').CronJob;
const { getUsers, patchUserMetadata } = require('../services/userServices.js');
const logger = require('../utils/logger');

var usageJob = new CronJob('0 0 1 * *', async function () {
  let query = 'user_metadata.plan:basic OR user_metadata.plan:premium';
  try {
    const users = await getUsers(query);
    users.forEach((user) => {
      //set the user_metatdata.usage_count to be zero.
      patchUserMetadata(user.user_id, { usage_count: 0 });
    });
  } catch (err) {
    logger.error('Error running usageJob: ', err);
  }
});

module.exports = usageJob;
