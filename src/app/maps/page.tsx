import { getServerAuthSession } from "@/server/auth";
import Map from "./map";

export default async function Page() {
    const session = await getServerAuthSession();
    if (session?.user.id != "c673f4df-2219-4068-91c2-af4de0634b3b") return <div>Not authorized</div>;
    return <Map />
}
