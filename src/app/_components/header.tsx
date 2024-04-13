import Image from "next/image";
import Link from "next/link";
import { User } from "./header/user";
import { getServerAuthSession } from "@/server/auth";

export default async function Header() {
    const session = await getServerAuthSession();
    return <div className="fixed z-10 w-full backdrop-blur border-b">
        <div className="max-w-6xl px-8 mx-auto flex justify-between items-center py-2">
            <div className="w-[40px]"></div>
            <div><Link href="/"><Image alt="koon.us" width={40} height={40} src="/logo.png" /></Link></div>
            <User session={session} />
        </div>
    </div>
}
