const express = require("express");
const rp = require("request-promise-native");

const router = express.Router();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/**
 * req.body is an object that should contain
 * zip: String matching /\d{5}/
 * (should not be a number, because a number will truncate leading zeros)
 * email: String, valid-ish email address
 * sms: String or Number matching /\d{10}/
 */
// expects body to contain {zip: 12345, to: [] }
router.post("/forecast-signup", function(req, res, next) {
  const SIGNUP_URL = "https://forecast-subscription.appspot.com/subscribe";

  const zip = req.body.zip;
  const methods = {
    email : req.body.email,
    sms   : req.body.sms
  };

  if (!methods.email && !methods.sms) {
    return res
      .status(400)
      .json({
        error: "Please include either a valid SMS number or email address"
      });
  }

  if (!zip) {
    return res
      .status(400)
      .json({ error: "Please include a valid postal code" });
  }

  Promise.all(
    Object.keys(methods)
      .filter(m => !!methods[m])
      .map(m =>
        rp.post(SIGNUP_URL, {
          json: true,
          body: {
            to: methods[m],
            zip: zip
          }
        })
      )
  )
    .then(response => res.status(200).json({ message: "OK" }))
    .catch(error => res.status(error.statusCode).json(error.error));
});

module.exports = router;
