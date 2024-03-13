import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { client } from "@/server/sms";
import { env } from "@/env";


const Phone = z.string().length(12).startsWith("+1", "Must start with +1");

export const authRouter = createTRPCRouter({
  sendOtp: publicProcedure
    .input(z.object({ phone: Phone }))
    .mutation(async ({ ctx, input }) => {
        try {
            const resp = await client.verify.v2
                .services(env.TWILIO_SERVICE_SID)
                .verifications
                .create({ to: input.phone, channel: "sms" });
                return resp.valid;
        } catch (e) {
            console.log(e);
            throw Error("Could not send a text to this phone");
        }
    })
});

