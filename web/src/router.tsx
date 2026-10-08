import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import { z } from "zod";
import { CreatorsPage } from "./pages/creators";
import { VideosPage } from "./pages/videos";

export const rootRoute = createRootRoute({
  component: Outlet,
});

const creatorsSearchSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).catch(1),
});

export const creatorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/creators",
  validateSearch: creatorsSearchSchema,
  component: CreatorsPage,
});

export const videosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/videos",
  component: VideosPage,
});

const routeTree = rootRoute.addChildren([creatorsRoute, videosRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
