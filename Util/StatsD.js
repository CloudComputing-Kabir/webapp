const StatsD = require('statsd-client');

const statsdClinet = new StatsD({
    host: 'localhost',
    port: 8125,
    prefix: 'webapp'
});

module.exports = statsdClinet;