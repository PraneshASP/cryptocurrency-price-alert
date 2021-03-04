const express = require("express");
const routes = require("./router");

const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ status: "Up and running" });
});

app.use(routes);

app.listen(PORT, () => console.log("Server started listening!"));
