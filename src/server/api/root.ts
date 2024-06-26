import { postRouter } from "@/server/api/routers/post";
import { authRouter } from "@/server/api/routers/auth";
import { mapsRouter } from "@/server/api/routers/maps";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  maps: mapsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
