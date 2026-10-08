import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { sql } from "drizzle-orm";
import type { DB } from "../src/context";
import * as schema from "../src/db/schema";
import { createApp } from "../src/index";
import { createSession } from "../src/services/sessions";

let db: DB | undefined;

export const testDb = async (): Promise<DB> => {
  if (!db) {
    const client = new PGlite();
    db = drizzle(client, { schema }) as unknown as DB;
    await db.execute(sql.raw(await Bun.file(new URL("./schema.sql", import.meta.url)).text()));
  }
  return db;
};

export const testClient = async () => {
  const tx = await testDb();
  const [organization] = await tx.insert(schema.organizations).values({ name: "Test Organization" }).returning();
  const [user] = await tx
    .insert(schema.users)
    .values({ organizationId: organization.organizationId, email: `${crypto.randomUUID()}@test.dev` })
    .returning();

  const token = crypto.randomUUID();
  createSession(token, user.userId);

  const app = createApp(tx);
  const request = (path: string, init?: RequestInit) =>
    app.request(path, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, ...init?.headers },
    });

  return { tx, organization, user, request };
};
