const redisEndpoint = require('../config/env.config.js').redisEndpoint,
    redis = require('redis');

const redisClient = async () => {
    // connect to redis endpoint
    const client = redis.createClient({
        url: redisEndpoint
    });
    client.on('error', (error) => {
        console.log("error: ", error);
    });
    // redis client connection
    await client.connect();
    return client;
};

exports.setKey = async (key, value) => {
    // redis client connection
    let client = await redisClient();
    // set key and value
    const result = await client.hSet(key, "blocked", '1');
    if(result){
        await client.expire(key, value);
    }
    // close redis connection
    client.quit();
    return result;
};


exports.getKey = async (key) => {
    // redis client connection
    let client = await redisClient();
    // get value
    let value = await client.get(key);
    // close redis connection
    client.quit();
    return value;
};

