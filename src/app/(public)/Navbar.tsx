"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Code2, LogOut, User } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getInitials(text: string): string {
    return text
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default function Navbar() {
    const { data: session, isPending } = authClient.useSession();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSignOut = async () => {
        setOpen(false);

        // 1. Clear the Better Auth session (Next.js side)
        await authClient.signOut();

        // 2. Clear the Keycloak SSO session so the browser doesn't stay logged in
        const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
        const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

        if (issuer && clientId) {
            const logoutUrl = new URL(`${issuer}/protocol/openid-connect/logout`);
            logoutUrl.searchParams.set("client_id", clientId);
            // Must be registered in Keycloak → Valid post logout redirect URIs
            logoutUrl.searchParams.set("post_logout_redirect_uri", window.location.origin);
            window.location.href = logoutUrl.toString();
        } else {
            window.location.href = "/";
        }
    };

    const user = session?.user;
    const displayName = user?.name ?? user?.email ?? "User";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">

                    {/* ── Logo ── */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                            <Code2 className="h-4 w-4" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">DevSolve</span>
                    </Link>

                    {/* ── Right side ── */}
                    <div className="flex items-center gap-3">

                        {/* Loading skeleton */}
                        {isPending && (
                            <div className="h-9 w-32 rounded-full bg-muted animate-pulse" />
                        )}

                        {/* Unauthenticated */}
                        {!isPending && !user && (
                            <Link
                                href="/account-type"
                                className={cn(buttonVariants({ size: "sm" }), "rounded-full px-5")}
                            >
                                Create Account
                            </Link>
                        )}

                        {/* Authenticated — profile pill + dropdown */}
                        {!isPending && user && (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    id="profile-menu-trigger"
                                    aria-haspopup="true"
                                    aria-expanded={open}
                                    onClick={() => setOpen((prev) => !prev)}
                                    className="flex items-center gap-2.5 rounded-full border border-border bg-background px-2.5 py-1.5 text-sm font-medium transition-all hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {/* Avatar */}
                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold overflow-hidden">
                                        {user.image ? (
                                            <img
                                                src={user.image}
                                                alt={displayName}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            getInitials(displayName)
                                        )}
                                    </span>
                                    <span className="hidden sm:block max-w-[120px] truncate">{displayName}</span>
                                    <ChevronDown
                                        className={cn(
                                            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                                            open && "rotate-180"
                                        )}
                                    />
                                </button>

                                {/* Dropdown panel */}
                                {open && (
                                    <div
                                        role="menu"
                                        aria-labelledby="profile-menu-trigger"
                                        className="absolute right-0 mt-2 w-60 rounded-xl border border-border bg-popover shadow-lg shadow-black/5 overflow-hidden"
                                        style={{ animation: "fadeSlideIn 0.15s ease-out" }}
                                    >
                                        {/* User info */}
                                        <div className="px-4 py-3 border-b border-border">
                                            <p className="text-sm font-semibold truncate">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="p-1.5 flex flex-col gap-0.5">
                                            <Link
                                                href="/profile"
                                                role="menuitem"
                                                onClick={() => setOpen(false)}
                                                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                                            >
                                                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                                                Profile
                                            </Link>
                                            <button
                                                role="menuitem"
                                                onClick={handleSignOut}
                                                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                            >
                                                <LogOut className="h-4 w-4 shrink-0" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
