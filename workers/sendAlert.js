const CronJob = require("cron").CronJob;
var Queue = require("bull");

const alerts = require("../alerts");

const config = require("../config");
const currentPrice = require("../helpers/currentPrice");
const sendEmailNotification = require("../helpers/sendEmailNotification");

var alertQueue = new Queue("alerts", config.REDIS_URL);

alertQueue.process(async function (job, done) {
  const { recipient, title, message } = job.data;
  let sendEmailResponse = await sendEmailNotification(
    recipient,
    message,
    title
  );
  if (sendEmailResponse.error) {
    done(new Error("Error sending alert"));
  }

  done();
});

var sendAlert = new CronJob("*/25 * * * * *", async function () {
  const currentPrices = await currentPrice();

  if (currentPrices.error) return;

  let priceObj = {
    BTC: currentPrices.data.BTC,
    ETH: currentPrices.data.ETH,
  };
  alerts.forEach((alert) => {
    let message, title, recipient;
    if (
      alert.type == "above" &&
      parseFloat(alert.price) <= parseFloat(priceObj[alert.asset])
    ) {
      message = `Price of ${
        alert.asset
      } has just exceeded your alert price of ${alert.price} USD.
      Current price is ${priceObj[alert.asset]} USD.`;

      title = `${alert.asset} is up!`;
      recipient = alert.email;

      alertQueue.add(
        { message, recipient, title },
        {
          attempts: 3,
          backoff: 3000,
        }
      );
    } else if (
      alert.type == "below" &&
      parseFloat(alert.price) > parseFloat(priceObj[alert.asset])
    ) {
      message = `Price of ${alert.asset} fell below your alert price of ${
        alert.price
      }.
      Current price is ${priceObj[alert.asset]} USD.`;

      recipient = alert.email;
      title = `${alert.asset} is down!`;

      alertQueue.add(
        { message, recipient, title },
        {
          attempts: 3,
          backoff: 3000,
        }
      );
    }
  });
});

sendAlert.start();
