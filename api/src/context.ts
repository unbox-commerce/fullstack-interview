import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "./db/schema";
import type { User } from "./db/schema";

export type DB = NodePgDatabase<typeof schema>;
export type TX = DB;

export type AppContext = {
  Variables: {
    context: { db: DB };
    user: User;
    organizationId: string;
  };
};
