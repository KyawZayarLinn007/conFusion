var express = require('express');
var router = express.Router();
let path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.resolve("./client/build/index.html"));
});

router.get("/home", (req, res) => {
  res.redirect("/");
})

module.exports = router;
