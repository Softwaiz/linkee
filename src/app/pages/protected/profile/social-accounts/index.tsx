"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, CheckCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { SocialAccountType } from "../../../../lib/shared";
import { SocialAccount } from "@db/index";
import { navigate } from "rwsdk/client";

export default function UserSocialAccounts({ accounts }: { accounts: SocialAccount[] }) {
    const googleAccount = useMemo(() => {
        return accounts.find((acc) => acc.type === SocialAccountType.GOOGLE);
    }, [accounts]);

    return <div className="w-full bg-card border border-input rounded-md p-4 space-y-4">
        <div className="flex flex-col items-start justify-center gap-1">
            <h6>
                Social accounts
            </h6>
            <p className="text-sm">
                Connect to your linkee account with your other social profiles.
            </p>
        </div>
        <div className="w-full">
            {
                !googleAccount ? <div className="w-full flex flex-row items-center justify-start gap-2">
                    <div className="grow flex flex-col items-start justify-center">
                        <p className="font-bold">Google</p>
                        <p className="text-sm opacity-75">Connect your Google account with Linkee.</p>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => {
                            navigate(`/profile/social/link?preferred=${SocialAccountType.GOOGLE}`)
                        }}>
                        Connect
                        <ArrowRight />
                    </Button>
                </div> : <div className="w-full flex flex-row items-center justify-start gap-2">
                    <div className="grow flex flex-col items-start justify-center">
                        <p className="font-bold">Google <span className="bg-green-500 text-green-100 p-0.5 rounded-full inline-flex">
                            <Check className="size-4 text-inherit" />
                        </span> </p>
                        <p className="text-sm opacity-75">Connected as <span className="text-xs border border-input px-1 py-0.5 rounded-sm">{googleAccount.email}</span></p>
                    </div>
                </div>
            }
        </div>
    </div>
}