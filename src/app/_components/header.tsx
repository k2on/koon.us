import Image from "next/image";
import Link from "next/link";

export default async function Header() {
    return <div className="fixed z-10 w-full backdrop-blur border-b">
        <div className="max-w-6xl px-8 mx-auto flex justify-center items-center py-2">
            <div><Link href="/"><Image alt="koon.us" width={40} height={40} src="/logo.png" /></Link></div>
        </div>
    </div>
}
