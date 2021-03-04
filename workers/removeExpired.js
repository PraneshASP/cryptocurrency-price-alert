const CronJob = require("cron").CronJob;
const alerts = require("../alerts");

var removeExpired = new CronJob("*/10 * * * * *", async function () {
  alerts.forEach((alert, index) => {
    if (new Date(alert.createdAt).getTime() + 5 * 1000 < new Date().getTime())
      alerts.splice(index, 1);
  });
});

removeExpired.start();
