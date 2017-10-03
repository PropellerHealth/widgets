const express = require("express");
const request = require("request");

const router  = express.Router();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.post('/notifications-signup', function(req, res, next) {
  console.log(req);
  console.log(req.body);
  res.status = 201;
  res.send();
});

module.exports = router;
