import { Hono } from "hono";
import { z } from "zod";
import type { AppContext } from "../../context";
import { zValidator } from "../../utils/validation";
import { VideosRepo } from "./repo";

const listValidator = zValidator(
  "query",
  z.object({
    organizationId: z.string(),
    search: z.string().optional(),
    status: z.enum(["live", "under_review", "removed"]).optional(),
    offset: z.coerce.number().default(0),
    limit: z.coerce.number().default(20),
  }),
);

const app = new Hono<AppContext>().get("/", listValidator, async (c) => {
  const { db } = c.get("context");
  const { organizationId, search, status, offset, limit } = c.req.valid("query");
  try {
    const items = await VideosRepo.list(db, organizationId, { search, status, offset, limit });
    const total = await VideosRepo.count(db, organizationId);
    return c.json({ videos: items, total });
  } catch (err) {
    console.warn("failed to list videos", err);
    return c.json({ videos: [], total: 0 });
  }
});

export default app;
