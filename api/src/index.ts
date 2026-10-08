import { Hono } from "hono";
import type { AppContext, DB } from "./context";
import { auth } from "./middleware/auth";
import { errorHandler } from "./middleware/error";
import creatorRoutes from "./resources/creators/routes";
import videoRoutes from "./resources/videos/routes";

export const createApp = (db: DB) => {
  return new Hono<AppContext>()
    .onError(errorHandler)
    .use("*", async (c, next) => {
      c.set("context", { db });
      await next();
    })
    .use("*", auth())
    .route("/creators", creatorRoutes)
    .route("/videos", videoRoutes);
};

export type AppType = ReturnType<typeof createApp>;
