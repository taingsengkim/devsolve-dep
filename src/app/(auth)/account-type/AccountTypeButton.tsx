"use client";

import React, {useState} from "react";
import { Button } from "@/components/ui/button";
import {ChevronRight, Loader2} from "lucide-react";
import {authClient} from "@/lib/auth/auth-client";


interface AccountTypeButtonProps {
    label: string;
    theme: "blue" | "emerald";
}

export default function AccountTypeButton({ label, theme }: AccountTypeButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSelection = async () => {
        setIsLoading(true);

        const result = await authClient.signIn.oauth2({
            providerId: "keycloak",
            callbackURL: `/`,
            disableRedirect: true, // handle redirect manually so we can debug
        });

        if (result?.error) {
            console.error("[Auth] Keycloak sign-in failed:", result.error);
            setIsLoading(false);
            return;
        }

        if (result?.data?.url) {
            console.log("[Auth] Redirecting to Keycloak:", result.data.url);
            window.location.href = result.data.url;
        } else {
            console.error("[Auth] No redirect URL returned:", result);
            setIsLoading(false);
        }
    };

    const themeClasses = theme === "blue"
        ? "border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
        : "border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700";

    return (
        <Button
            onClick={handleSelection}
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 rounded-full font-medium group transition-colors ${themeClasses}`}
            variant="outline"
        >
            {isLoading ? (
                <>
                    Connecting...
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                </>
            ) : (
                <>
                    {label}
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                </>
            )}
        </Button>
    );
}