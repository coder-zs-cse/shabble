'use client'
import { signIn } from "next-auth/react"
import { useState } from "react"
import { Title, Text, Button, Divider } from "@/components"
import { FcGoogle } from "react-icons/fc"

export default function LoginPage() {
    const [email, setEmail] = useState("")

    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gray-200">
            <div className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md">
                <div className="flex flex-col gap-2 text-center">
                    <Title title="Secure your stats with an account" className="!text-[20px] md:!text-[24px]" />
                    <Text className="text-gray-500 text-sm">
                        Use your email or social profile to create an account or to log in to an existing account. Your stats will be synced across all logged in devices :)
                    </Text>
                </div>

                <div className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && email && signIn("google", { callbackUrl: "/daily" }, { login_hint: email })}
                        className="w-full h-[48px] px-4 border border-gray-200 rounded-[7px] md:rounded-[10px] text-sm outline-none focus:border-gray-400"
                    />
                    <Button
                        disabled={!email}
                        onClick={() => signIn("google", { callbackUrl: "/daily" }, { login_hint: email })}
                        className="text-sm font-semibold tracking-wide"
                    >
                        CONTINUE
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <Divider />
                    <Text className="text-gray-400 text-sm whitespace-nowrap">— or —</Text>
                    <Divider />
                </div>

                <Button
                    onClick={() => signIn("google", { callbackUrl: "/daily" })}
                    className="gap-2 text-sm font-semibold tracking-wide"
                >
                    <FcGoogle className="w-5 h-5" />
                    CONTINUE WITH GOOGLE
                </Button>
            </div>
        </div>
    )
}
