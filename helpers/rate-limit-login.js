const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 100 requests per windowMs
    handler: (req, res, next) => {
      return res.status(429).json({status: 'error', code: 429, message: 'Too many requests'})
  }
});

module.exports = limiter