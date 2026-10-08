import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, count, desc, eq, ilike, sum } from "drizzle-orm";
import type { TX } from "../../context";
import {
  type Creator,
  creators,
  type Video,
  videoDayMetrics,
  type VideoStatus,
  videos,
} from "../../db/schema";

const s3 = new S3Client({ region: "eu-west-1" });

type VideoWithCreator = Video & {
  creator: Creator | undefined;
  views: number;
  thumbnailUrl: string;
};

export class VideosRepo {
  static async list(
    tx: TX,
    organizationId: string,
    {
      search,
      status,
      offset,
      limit,
    }: { search?: string; status?: VideoStatus; offset: number; limit: number },
  ): Promise<VideoWithCreator[]> {
    const rows = await tx
      .select()
      .from(videos)
      .where(
        and(
          eq(videos.organizationId, organizationId),
          search?.length ? ilike(videos.title, `%${search}%`) : undefined,
          status ? eq(videos.status, status) : undefined,
        ),
      )
      .orderBy(desc(videos.postedAt))
      .limit(limit)
      .offset(offset);

    const result: VideoWithCreator[] = [];
    for (const video of rows) {
      const [creator] = await tx
        .select()
        .from(creators)
        .where(eq(creators.creatorId, video.creatorId))
        .limit(1);
      const [metrics] = await tx
        .select({ views: sum(videoDayMetrics.views).mapWith(Number) })
        .from(videoDayMetrics)
        .where(eq(videoDayMetrics.videoId, video.videoId));
      const thumbnailUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.THUMBNAILS_BUCKET,
          Key: video.thumbnailKey,
        }),
        { expiresIn: 3600 },
      );
      result.push({ ...video, creator, views: metrics?.views ?? 0, thumbnailUrl });
    }
    return result;
  }

  static async count(tx: TX, organizationId: string): Promise<number> {
    const [row] = await tx
      .select({ total: count() })
      .from(videos)
      .where(eq(videos.organizationId, organizationId));
    return row?.total ?? 0;
  }
}
