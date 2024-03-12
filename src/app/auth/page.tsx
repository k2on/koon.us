"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRifm } from "rifm";
import parsePhoneNumberFromString, { AsYouType, parseNumber, isValidNumber, isValidPhoneNumber } from "libphonenumber-js";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Spinner } from "@/components/ui/spinner";
import { OctagonAlertIcon } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


const parseDigits = (string: string) => (string.match(/\d+/g) || []).join("");

const formatPhone = (string: string) => {
    const digits = parseDigits(string).substr(0, 10);
    return new AsYouType("US").input(digits);
};

export default function Auth() {
    const router = useRouter();

    const [value, setValue] = useState("");
    const [code, setCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);


    const rifm = useRifm({
        value,
        onChange: setValue,
        format: formatPhone,
    });

    const { mutate: sendOtp, isLoading: isSendingOtp, error } = api.auth.sendOtp.useMutation({
        onSuccess(data, variables, context) {
            setIsCodeSent(true);
        },
    });

    const phone = parsePhoneNumberFromString(rifm.value, "US")?.number! as string || "";

    const onNext = () => {
        sendOtp({ phone });
    }

    const onLogin = () => {
        signIn("credentials", { redirect: false, phone, code }).then(to => {
            let back = "/";
            if (to?.url) {
                const url = new URL(to.url);
                back = url.searchParams.get("callbackUrl") || "/";
            }
            window.location.href = back;
        });
    }

    return (
        <main className="flex h-screen items-center justify-center bg-black">
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                        {isCodeSent ? "We sent a code to " + value + "." : "Sign in to koon.us with your phone."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isCodeSent
                    ? <>
                        <InputOTP
                          autoFocus
                          value={code}
                          onChange={setCode}
                          onComplete={onLogin}
                          maxLength={6}
                          render={({ slots }) => (
                            <>
                              <InputOTPGroup>
                                {slots.slice(0, 3).map((slot, index) => (
                                  <InputOTPSlot key={index} {...slot} />
                                ))}{" "}
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                {slots.slice(3).map((slot, index) => (
                                  <InputOTPSlot key={index + 3} {...slot} />
                                ))}
                              </InputOTPGroup>
                            </>
                          )}
                        />

                    </>
                    : <>
                    <div
                        className={`flex flex-row items-center rounded-md border border-input bg-background text-sm ${error && "border-red-500 border-2"}`}
                        dir="ltr"
                    >
                        <span className="flex h-10 text-gray-400 items-center justify-center rounded-s-md border-r border-r-input bg-zinc-900 px-2">
                            +1
                        </span>
                        <Input
                            id="phone"
                            autoFocus
                            disabled={isSendingOtp}
                            autoComplete="tel"
                            className="border-none"
                            placeholder="(000) 000-0000"
                            value={rifm.value}
                            onChange={rifm.onChange}
                            onKeyDown={(e) => e.key == "Enter" && isValidNumber(phone) && onNext()}
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm flex flex-row items-center space-x-1 mt-1"><OctagonAlertIcon className="w-4 h-4" /> <span>{error.message}</span></div>}

                    </>}
                </CardContent>
                <CardFooter>
                    {isCodeSent ?
                    <Button onClick={onLogin} disabled={code.length != 6} className="w-full">{isSendingOtp ? 
                    <><Spinner />Login</> : "Login"}</Button>
                    :
                    <Button onClick={onNext} disabled={!isValidNumber(phone) || isSendingOtp} className="w-full">{isSendingOtp ? 
                    <><Spinner />Next</> : "Next"}</Button>

                    }
                    
                </CardFooter>
            </Card>
        </main>
    );
}

function Phone() {

}
