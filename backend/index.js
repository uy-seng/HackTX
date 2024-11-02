const express = require("express");
const app = express();
const port = 5000;

app.get("/", (req, res) => {
  res.json({
    msg: "Hello World v2",
  });
});

app.listen(port, () => {
  console.log(`MockeyInterview Server is listening on port ${port}`);
});
