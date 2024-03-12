import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const Phone = z.string().length(12).startsWith("+1", "Must start with +1");

export const authRouter = createTRPCRouter({
  sendOtp: publicProcedure
    .input(z.object({ phone: Phone }))
    .mutation(async ({ ctx, input }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return true;
    })
});

