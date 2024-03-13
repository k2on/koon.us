import { unstable_noStore as noStore } from "next/cache";

import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Header from "./_components/header";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  return (
    <main className="">
        <Header />
        <div className="h-screen flex items-center justify-center">
            <h1 className="text-8xl font-bold italic">Welcome</h1>
        </div>
    </main>
  );
}
