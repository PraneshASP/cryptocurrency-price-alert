const axios = require("axios");

module.exports = async () => {
  try {
    let url =
      "https://api.nomics.com/v1/currencies/ticker?key=e21f86baf43f3392e3d2ebca1f918818&ids=BTC,ETH&interval=1m&convert=USD&per-page=2&page=1";
    const resp = await axios.get(url);
    return {
      error: false,
      data: { BTC: resp.data[0].price, ETH: resp.data[1].price },
    };
  } catch (error) {
    console.error("Fetch price error", error);
    return { error: true };
  }
};
