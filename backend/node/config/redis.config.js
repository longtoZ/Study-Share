import redis from 'redis';

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('REDIS_URL:', process.env.REDIS_URL);
  console.log('Connected to Redis');
});

await redisClient.connect();

export default redisClient;