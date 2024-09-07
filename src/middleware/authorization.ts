import { bearerAuth } from "hono/bearer-auth";
import { getSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

// const authorization = createMiddleware((c, next) => {
   
// })