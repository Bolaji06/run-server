import { Context, Hono, Next } from "hono";
import { validator } from "hono/validator";
import { registerSchema, registerType } from "../utils/validation";
import { createMiddleware } from "hono/factory";
import next from "next";

const app = new Hono();

export const registerValidator = createMiddleware(async (c, next) => {
  validator("form", (value: registerType) => {
    const parsedSchema = registerSchema.safeParse(value);
    if (!parsedSchema.success) {
      return c.text("Invalid values", 401);
    }
    return parsedSchema.data;
  });
  await next();
});
