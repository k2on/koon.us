import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { buildingPoints, buildings, floors, posts } from "@/server/db/schema";
import { eq, isNull } from "drizzle-orm";

export const mapsRouter = createTRPCRouter({
  getCollege: publicProcedure.query(async ({ ctx }) => {
    const college = await ctx.db.query.colleges.findFirst({
      with: {
          buildings: {
              with: {
                  points: true,
                  floors: true,
              },
              where: isNull(buildings.removedAt),
          }
      }
    });
    if (!college) throw Error("No colleges");
    return college;
  }),
  saveBuilding: protectedProcedure
    .input(z.object({
        building: z.object({
            collegeId: z.string(),
            id: z.string(),
            name: z.string(),
            removedAt: z.date().nullable(),
        }),
        points: z.array(z.object({
            id: z.string(),
            lat: z.number(),
            lng: z.number(),
        })),
        floors: z.array(z.object({
            id: z.string(),
            buildingId: z.string(),
            label: z.string(),
            imageUrl: z.string(),
        })),
    }))
    .mutation(async ({ ctx, input }) => {
        if (ctx.session.user.id != "c673f4df-2219-4068-91c2-af4de0634b3b") throw Error("Unauthorized");
        await ctx.db.insert(buildings)
            .values(input.building)
            .onConflictDoUpdate({
                target: buildings.id,
                set: input.building,
            });

        for (const point of input.points) {
            await ctx.db.insert(buildingPoints)
                .values({...point, ...{
                    buildingId: input.building.id,
                }})
                .onConflictDoUpdate({
                    target: buildingPoints.id,
                    set: point,
                });
        }

        for (const floor of input.floors) {
            await ctx.db.insert(floors)
                .values({...floor, ...{
                    buildingId: input.building.id,
                }})
                .onConflictDoUpdate({
                    target: floors.id,
                    set: floor
                });
        }
        return true;
    }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
