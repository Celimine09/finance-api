import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "./prisma.service";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyAndLoginGoogleUser = async (credential: string) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    throw new Error("INVALID_GOOGLE_TOKEN");
  }

  let user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: payload.email,
        name: payload.given_name || "",
        surname: payload.family_name || "",
        googleId: payload.sub,
      },
    });
  } else if (!user.googleId) {
    user = await prisma.user.update({
      where: { email: user.email },
      data: { googleId: payload.sub },
    });
  }

  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" },
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" },
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };
};
