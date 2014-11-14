var limiter = require("connect-ratelimit"),
    config = require("config")
    ,winston = require("winston");

var ratelimit = config.get("ratelimit");

module.exports = function() {
    winston.info("Initializing Ratelimit");
    winston.info("info", "Ratelimit settings: %s",config.get("ratelimit"));

    this.use(limiter(ratelimit));

    winston.info("Initialized Ratelimit");

}
