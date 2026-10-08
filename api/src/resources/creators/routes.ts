import { Hono } from "hono";
import { z } from "zod";
import type { AppContext } from "../../context";
import { zValidator } from "../../utils/validation";
import { CreatorsRepo } from "./repo";

const listValidator = zValidator(
  "query",
  z.object({
    search: z.string().optional(),
    offset: z.coerce.number().int().min(0).default(0),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
);

const countValidator = zValidator(
  "query",
  z.object({
    search: z.string().optional(),
  }),
);

const app = new Hono<AppContext>()
  .get("/", listValidator, async (c) => {
    const organizationId = c.get("organizationId");
    const { db } = c.get("context");
    const { search, offset, limit } = c.req.valid("query");
    const items = await CreatorsRepo.list(db, organizationId, { search, offset, limit });
    return c.json({ creators: items });
  })
  .get("/count", countValidator, async (c) => {
    const organizationId = c.get("organizationId");
    const { db } = c.get("context");
    const { search } = c.req.valid("query");
    const total = await CreatorsRepo.count(db, organizationId, { search });
    return c.json({ total });
  });

export default app;
