"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";

interface AccountTypeButtonProps {
    label: string;
    theme: "blue" | "emerald";
    role?: "user" | "company";
}

export default function AccountTypeButton({ label, theme, role }: AccountTypeButtonProps) {
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
        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-[0.99]"
        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 active:scale-[0.99]";

    return (
        <Button
            onClick={handleSelection}
            disabled={isLoading}
            className={`w-full h-11 px-8 rounded-full font-semibold group transition-all duration-200 ${themeClasses}`}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                </span>
            ) : (
                <span className="flex items-center justify-center gap-2">
                    <span>{label}</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
            )}
        </Button>
    );
}