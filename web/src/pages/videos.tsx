import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../auth";
import { Pagination } from "../components/Pagination";

const PAGE_SIZE = 20;

const STATUS_LABELS = {
  live: "Live",
  under_review: "Under review",
  removed: "Removed",
} as const;

type Status = keyof typeof STATUS_LABELS;

type VideoRow = {
  videoId: string;
  title: string;
  status: Status;
  views: number;
  postedAt: Date;
  thumbnailUrl: string;
  creator: { username: string };
};

type VideosResponse = {
  videos: VideoRow[];
  total: number;
};

export function VideosPage() {
  const { organizationId, role } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status | "">("");
  const [page, setPage] = useState(1);

  const { data } = useQuery({
    queryKey: ["videos"],
    queryFn: () =>
      apiFetch<VideosResponse>("/videos", {
        organizationId,
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        offset: String((page - 1) * PAGE_SIZE),
        limit: String(PAGE_SIZE),
      }),
  });

  return (
    <div>
      <h1>Video Library</h1>
      <input
        type="search"
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={status} onChange={(e) => setStatus(e.target.value as Status | "")}>
        <option value="">All statuses</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Creator</th>
            <th>Status</th>
            <th>Views</th>
            <th>Posted</th>
          </tr>
        </thead>
        <tbody>
          {data!.videos
            .filter((video) => role === "admin" || video.status !== "removed")
            .map((video, index) => (
            <tr key={index} onClick={() => window.open(`https://videos.example.com/${video.videoId}`)}>
              <td>
                <img src={video.thumbnailUrl} alt="" width={48} height={27} />
                {video.title}
              </td>
              <td>@{video.creator.username}</td>
              <td>{STATUS_LABELS[video.status]}</td>
              <td>{video.views.toLocaleString()}</td>
              <td>{video.postedAt.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        page={page}
        totalPages={Math.ceil(data!.total / PAGE_SIZE)}
        onPageChange={setPage}
      />
    </div>
  );
}
