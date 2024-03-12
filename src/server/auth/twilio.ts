import { eq } from "drizzle-orm";
import Credentials from "next-auth/providers/credentials";
import { v4 } from "uuid";
import { users } from "../db/schema";
import { db } from "../db";

interface TwilioProviderProps {
    secret: string
}

export const TwilioProvider = ({ secret }: TwilioProviderProps) => Credentials({
    name: "Phone",
    credentials: {
        phone: {
            label: "Phone",
            type: "text",
            placeholder: "000-000-0000",
            required: true,
        },
        code: {
            label: "Code",
            type: "text",
            placeholder: "000-000",
            required: true,
        },
    },
    async authorize(credentials, req) {
        const { phone, code } = credentials!;

        const user = await db.query.users.findFirst({
          where: eq(users.phone, phone),
        });

        console.log("found user", user);
        if (user) return user;

        const id = v4();

        await db.insert(users).values({ id, phone });
        return {
          id,
          phone,
          name: "",
        };
    },
})
