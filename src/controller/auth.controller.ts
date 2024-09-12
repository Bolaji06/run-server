import { Prisma } from "@prisma/client";
import { Context } from "hono";
import prisma from "../lib/prisma";
import { generateRandomToken } from "../utils/randomToken";
import { registerType } from "../utils/validation";
import bcrypt from "bcrypt";
import { decode, sign, verify } from "hono/jwt";

import { validator } from "hono/validator";
import {
  deleteCookie,
  getCookie,
  getSignedCookie,
  setSignedCookie,
} from "hono/cookie";

const cookieKey = `${process.env.COOKIE_LOGIN_KEY}`;

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

    const saltRounds = 10;
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
    return c.json({ success: true, message: "account created" }, 201);
  } catch (err) {
    console.log(err);
    return c.json({ success: false, message: "internal server error" }, 500);
  }
}

export async function login(c: Context) {
  const body = await c.req.json();

  const { email, password } = body;

  try {
    const isUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!isUser) {
      return c.json(
        { success: false, message: "user with email not found" },
        404
      );
    }
    const dbPassword = isUser.password;
    const checkPassword = await bcrypt.compare(password, dbPassword);
    if (!checkPassword) {
      return c.json({ success: false, message: "invalid password" }, 400);
    }

    const payload = {
      id: isUser.id,
      username: isUser.email,
      email: isUser.email,
      avatar: isUser.avatar,
      exp: Math.floor(Date.now() / 1000) + 3600 * 60,
    };

    const secret = `${process.env.JWT_TOKEN}`;
    const token = await sign(payload, secret);

    await setSignedCookie(c, cookieKey, token, secret);

    return c.json({ success: true, message: "login success", token });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return c.json({ success: false, message: "internal server error" }, 500);
    }
  }
}

export async function logout(c: Context) {
  try {
    const isSignedIn = await getSignedCookie(c, cookieKey);

    if (!isSignedIn) {
      return;
    }

    deleteCookie(c, cookieKey);
    return c.json({ success: true, message: "user logout successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    return c.json({ success: false, message: 'internal server error' });
  }
}
