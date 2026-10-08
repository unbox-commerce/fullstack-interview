import type { MiddlewareHandler } from "hono";
import { eq } from "drizzle-orm";
import type { AppContext } from "../context";
import { users } from "../db/schema";
import { AuthorisationError } from "../errors";
import { verifySessionToken } from "../services/sessions";

export const auth = (): MiddlewareHandler<AppContext> => async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new AuthorisationError("Missing session token");
  }

  const userId = await verifySessionToken(token);
  const { db } = c.get("context");
  const [user] = await db.select().from(users).where(eq(users.userId, userId)).limit(1);
  if (!user) {
    throw new AuthorisationError("Session user not found");
  }

  c.set("user", user);
  c.set("organizationId", user.organizationId);
  await next();
};
