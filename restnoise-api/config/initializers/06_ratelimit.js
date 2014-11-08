var limiter = require("connect-ratelimit"),
    config = require("config");

var ratelimit = config.get("httpserver.ratelimit");

module.exports = function() {
console.log(ratelimit);
    this.use(limiter(ratelimit));

}
