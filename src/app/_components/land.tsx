"use client"

import Spline from "@splinetool/react-spline";
import Link from "next/link";

export const Land = () => {
    return <div className="h-screen flex items-center justify-center pt-[56px]">
        <div className="p-8 w-full h-full max-w-6xl mx-auto">
            <div className="rounded-xl border bg-zinc-900 w-full h-full overflow-hidden shadow-2xl shadow-blue-400/20">
                <div className="w-full h-full relative">
                    <div className="pointer-events-none absolute top-12 w-full flex justify-center animate-fadeInUp">
                        <h1 className="text-5xl text-transparent bg-clip-text bg-gradient-to-t from-gray-400 to-white h-[60px]">Seeking answers?</h1>
                    </div>

                    <div className="absolute bottom-24 w-full flex justify-center animate-fadeInUp2">
                        <Link href="https://jesus.koon.us"><div className="backdrop-blur border border-gray-200/20 rounded-full p-4 text-gray-200 transition-all bg-white/10 hover:bg-white/20">Learn about Jesus</div></Link>

                    </div>
                
                    <Spline scene="https://prod.spline.design/8RGEP0ZUwgMa6g9Q/scene.splinecode" />
                </div>
            </div>
        </div>
    </div>
}
