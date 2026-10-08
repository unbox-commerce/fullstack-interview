import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { apiFetch } from "../api/client";
import { Pagination } from "../components/Pagination";
import { creatorsRoute } from "../router";

const PAGE_SIZE = 20;

type Creator = {
  creatorId: string;
  username: string;
  displayName: string;
  createdAt: string;
};

export function CreatorsPage() {
  const { search, page } = creatorsRoute.useSearch();
  const navigate = useNavigate({ from: creatorsRoute.fullPath });

  const creatorsQuery = useQuery({
    queryKey: ["creators", { search, page }],
    queryFn: () =>
      apiFetch<{ creators: Creator[] }>("/creators", {
        ...(search ? { search } : {}),
        offset: String((page - 1) * PAGE_SIZE),
        limit: String(PAGE_SIZE),
      }),
  });

  const countQuery = useQuery({
    queryKey: ["creators", "count", { search }],
    queryFn: () => apiFetch<{ total: number }>("/creators/count", search ? { search } : {}),
  });

  if (creatorsQuery.isPending) {
    return <p>Loading creators…</p>;
  }

  if (creatorsQuery.isError) {
    return <p role="alert">Something went wrong loading creators. Try refreshing.</p>;
  }

  return (
    <div>
      <h1>Creators</h1>
      <input
        type="search"
        placeholder="Search by username"
        defaultValue={search}
        onChange={(e) =>
          navigate({ search: (prev) => ({ ...prev, search: e.target.value || undefined, page: 1 }) })
        }
      />
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Display name</th>
            <th>Added</th>
          </tr>
        </thead>
        <tbody>
          {creatorsQuery.data.creators.map((creator) => (
            <tr key={creator.creatorId}>
              <td>@{creator.username}</td>
              <td>{creator.displayName}</td>
              <td>{new Date(creator.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {creatorsQuery.data.creators.length === 0 && <p>No creators found.</p>}
      <Pagination
        page={page}
        totalPages={Math.ceil((countQuery.data?.total ?? 0) / PAGE_SIZE)}
        onPageChange={(next) => navigate({ search: (prev) => ({ ...prev, page: next }) })}
      />
    </div>
  );
}
