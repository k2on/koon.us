"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface UserProps {
    session: Session | null;
}
export function User({ session }: UserProps) {
    return session?.user ? <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src={session.user.image || undefined} />
                        <AvatarFallback>MK</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <Link href="/me"><DropdownMenuItem>Profile</DropdownMenuItem></Link>
                    <DropdownMenuItem onClick={() => {
                        signOut();
                    }}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu> : <Link href={`/api/auth/signin`}><Button size="sm">Login</Button></Link>

    }
