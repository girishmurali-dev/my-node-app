const express = require('express');
const { createClient } = require('redis');

const app = express();

// Connect to Redis. The host name comes from an environment variable.
const redis = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:6379`,
});
redis.on('error', (err) => console.error('Redis error:', err.message));

// Home page: add 1 to the counter and show it
app.get('/', async (req, res) => {
  const visits = await redis.incr('visits');
  res.send(`<h1>Hello from Node + Redis!</h1><p>This page has been visited <b>${visits}</b> times.</p>`);
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

async function start() {
  await redis.connect();
  console.log('Connected to Redis at', process.env.REDIS_HOST);
  app.listen(3000, () => console.log('App listening on port 3000'));
}
start();
