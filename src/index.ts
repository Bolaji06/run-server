import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import { cors } from "hono/cors";
import workSpaceRoutes from "./routes/workspace";

const PORT = 3000;
const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:5173"],
    allowHeaders: [
      "X-Custom-Header",
      "Upgrade-Insecure-Requests",
      "Content-Type",
      "Authorization"
    ],
    allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

app.route("/api/auth", authRoutes);
app.route("/api/user", userRoutes);
app.route("/api/workspace", workSpaceRoutes);

console.log("Server running at", PORT);
serve({
  fetch: app.fetch,
  port: PORT,
});
