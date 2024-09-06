import { Prisma } from "@prisma/client";
import { Context } from "hono";
import prisma from "../lib/prisma";
import { generateRandomToken } from "../utils/randomToken";
import { registerType } from "../utils/validation";

import { validator } from "hono/validator";

export async function register(c: Context) {
  //const body: registerType = await c.req.json();
  const body  = c.req.valid("form") 

  const { email, password, username } = body;
  const verifyToken = generateRandomToken();

  try {
    const isUser = await prisma.user.findUnique({
      where: {
        email,
        username
      },
    });
    if (isUser) {
      return c.json({
        success: false,
        message: "user with email or username already exists",
      });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        username,
        verifyToken,
      },
    });
    if (!newUser) {
      return c.json(
        { success: false, message: "failed to create account" },
        400
      );
    }
    return c.json({ success: true, message: newUser }, 201);
  } catch (err) {
    console.log(err);
    return c.json({ success: false, message: "internal server error" }, 500);
  }
}
