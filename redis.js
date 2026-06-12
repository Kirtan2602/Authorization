import Redis from "ioredis";

// Create Redis connection
const redisClient = new Redis(
  process.env.REDIS_URL || {
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: 3,
  }
);

// Success log
redisClient.on("connect", () => {
  console.log("Redis connected");
});

// Error log
redisClient.on("error", (err) => {
  console.error("Redis error:", err.message);
});

export default redisClient;