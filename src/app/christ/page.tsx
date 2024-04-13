import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";

export default async function Page() {
    return <div className="mx-auto max-w-3xl min-h-screen">
        <Post />
    </div>
}

async function Post() {
    const session = await getServerAuthSession();

    if (!session) return <Link href={`/api/auth/signin`}><Button size="sm">Login</Button></Link>
}
