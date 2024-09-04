import 'dotenv/config'

import { serve } from '@hono/node-server';
import app from './lib/app';

app.get('/', (h) => 
  h.text("Welcome to hono")
)

app.get('/post', (h) =>
  h.json({ success: true, message: "Posted" })
)

const PORT = 3000;

console.log('Server running at',PORT)

serve({
  fetch: app.fetch,
  port: PORT
})