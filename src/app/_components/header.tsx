import { Session, getServerSession } from "next-auth";
import Image from "next/image";
import { User } from "./header/user";
import Link from "next/link";

export default async function Header() {
    const session = await getServerSession();
    return <div className="w-full bg-zinc-950 border-b">
        <div className="max-w-3xl mx-auto flex justify-between items-center py-2">
            <div><Link href="/"><Image alt="koon.us" width={30} height={30} src="/logo.png" /></Link></div>
            <div><User session={session} /></div>
        </div>
    </div>
}
