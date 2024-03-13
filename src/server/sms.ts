import { env } from "@/env";
import Client from "twilio";

export const client = Client(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
