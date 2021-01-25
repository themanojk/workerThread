const promises = require('bluebird');
const redis = require('redis');
const RedisNotifier = require('redis-notifier');
let eventHandler = require('../routes/dynamicEvents');

const config = {
    'port': process.env.SERVICES_CACHE_PORT || 6379,
    'host': process.env.SERVICES_CACHE_HOST || '127.0.0.1',

    'options': {
        'retry_max_delay': process.env.SERVICES_CACHE_OPTIONS_RETRY_MAX_DELAY || 500,
        'max_attempts': process.env.SERVICES_CACHE_OPTIONS_MAX_ATTEMPTS || 5
    }
};

let eventNotifier = new RedisNotifier(redis, {
    redis: { host: '127.0.0.1', port: 6379 },
    expired: true,
    evicted: true,
    logLevel: 'DEBUG' //Defaults To INFO
});

let cache = promises.promisifyAll(redis.createClient(config.port, config.host, config.options));

eventNotifier.on('message', function (pattern, channelPattern, emittedKey) {
    var channel = this.parseMessageChannel(channelPattern);

    console.log(channel)
    switch (channel.key) {
        case 'expired':
            eventHandler.fireEvent(emittedKey);
            break;

        default:
            logger.debug("Unrecognized Channel Type:" + channel.type);
    }
});


module.exports.cache = cache;
