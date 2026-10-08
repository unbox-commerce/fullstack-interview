import { and, count, desc, eq, ilike } from "drizzle-orm";
import type { TX } from "../../context";
import { type Creator, creators } from "../../db/schema";

type ListFilters = { search?: string };

export class CreatorsRepo {
  static async list(
    tx: TX,
    organizationId: string,
    { search, offset, limit }: ListFilters & { offset: number; limit: number },
  ): Promise<Creator[]> {
    return tx
      .select()
      .from(creators)
      .where(CreatorsRepo.filters(organizationId, { search }))
      .orderBy(desc(creators.createdAt), creators.creatorId)
      .limit(limit)
      .offset(offset);
  }

  static async count(tx: TX, organizationId: string, filters: ListFilters): Promise<number> {
    const [row] = await tx
      .select({ total: count() })
      .from(creators)
      .where(CreatorsRepo.filters(organizationId, filters));
    return row?.total ?? 0;
  }

  private static filters(organizationId: string, { search }: ListFilters) {
    return and(
      eq(creators.organizationId, organizationId),
      search?.length ? ilike(creators.username, `%${search}%`) : undefined,
    );
  }
}
