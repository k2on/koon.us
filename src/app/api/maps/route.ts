import { db } from "@/server/db";
import { buildings } from "@/server/db/schema";
import { isNull } from "drizzle-orm";

export async function GET() {
    const college = await db.query.colleges.findFirst({
        with: {
            buildings: {
                with: {
                    points: true,
                    floors: true,
                },
                where: isNull(buildings.removedAt),
            }
        },
    });
    return Response.json(college);
}
