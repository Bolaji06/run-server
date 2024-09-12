import { Next } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { getSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { Context } from "hono";
import { jwt } from "hono/jwt";


export const authMiddleware = createMiddleware(async (c, next) => {
    const jwtMiddleware = jwt({
        secret: process.env.JWT_TOKEN as string
    })
    await jwtMiddleware(c, next);
    const payload = c.get("jwtPayload");
    c.set("jwtPayload", payload);
})
