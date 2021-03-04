const currentPrice = require("./helpers/currentPrice");
const { errorObject } = require("./config");
const alerts = require("./alerts");
require("./workers/index.js");

exports.CurrentPrice = async (req, res) => {
  try {
    let prices = await currentPrice();
    if (prices.error) return res.status(500).json(errorObject);
    return res.status(200).json({
      success: true,
      price_data: prices.data,
    });
  } catch (error) {
    console.error("Current price error", error);
    return res.status(500).json(errorObject);
  }
};

exports.CreateAlert = async (req, res) => {
  try {
    const { asset, price, email, type } = req.body;
    if (!asset || !price || !email || !type)
      return res.status(400).json({
        error: true,
        message: "Please provide the asset and price",
      });

    if (asset.toLowerCase() != "btc" && asset.toLowerCase() != "eth")
      return res.status(400).json({
        error: true,
        message: "Currently we support BTC and ETH only.",
      });

    alerts.push({
      asset: asset,
      price: price,
      email: email,
      type: type.toLowerCase(),
      createdAt: new Date(),
    });
    return res.send({ success: true, message: "Alert created" });
  } catch (error) {
    console.error("Create alert error", error);
    return res.status(500).json(errorObject);
  }
};

exports.GetAlerts = async (req, res) => {
  try {
    return res.send({ success: true, alerts: alerts });
  } catch (error) {
    console.error("Get alert error", error);
    return res.status(500).json(errorObject);
  }
};
