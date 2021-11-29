const rateLimiter = require("express-rate-limit");
const SendResponse = require("../helper/SendResponse/SendResponse");
const RateLimit = rateLimiter({
  windowMs: 1 * 60 * 1000,
  max: 5,
  handler: function (req, res, next) {
    res.send(
      SendResponse(false, "Too many requests sent, Please try again later", {})
    );
  },
});
module.exports = RateLimit;
