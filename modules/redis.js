const Redis = require('redis');

// Redis
// Setup Redis connection
const redisClient = Redis.createClient({
    host: 'localhost',
    port: 6379,
});

const DEFAULT_EXPIRATION = 300; // 5 minutes

const startRedis = async () => {
    if (!await redisClient.isOpen) {
        console.log('Connecting to Redis ...');
        await redisClient.connect();
        console.log('Connection to Redis successful.');
    } else {
        console.log('Already connected to Redis.');
    }
};

module.exports = {
    startRedis,
    redisClient,
    DEFAULT_EXPIRATION,
};