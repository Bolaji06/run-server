import 'dotenv/config'

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

const PORT = 3000
const app = new Hono();

app.route('/api/auth', authRoutes);
app.route('/api/user', userRoutes);


console.log('Server running at', PORT);
serve({
  fetch: app.fetch,
  port: PORT,
})
