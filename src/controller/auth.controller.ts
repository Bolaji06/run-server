import { Prisma } from "@prisma/client";
import { Context } from "hono";
import prisma from "../lib/prisma";
import { generateRandomToken } from "../utils/randomToken";
import { registerType } from "../utils/validation";
import bcrypt from "bcrypt"
import { decode, sign, verify } from "hono/jwt";

import { validator } from "hono/validator";

export async function register(c: Context) {
  const body: registerType = await c.req.json();

  const { email, password, username } = body;
  const verifyToken = generateRandomToken();

  try {
    const isUser = await prisma.user.findUnique({
      where: {
        email,
        username,
      },
    });
    if (isUser) {
      return c.json({
        success: false,
        message: "user with email or username already exists",
      });
    }

    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
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

export async function login(c: Context){
  const body = await c.req.json()

  const { email, password } = body;

  try{
    const isUser = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (!isUser){
      return c.json({ success: false, message: 'user with email not found'}, 404);
    }

    

  }catch(error){
    if (error instanceof Error){
      console.log(error);
      return c.json({ success: false, message: 'internal server error'}, 500);
    }
  }

}
