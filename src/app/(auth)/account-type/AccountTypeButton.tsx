"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface AccountTypeButtonProps {
    label: string;
    theme: "blue" | "emerald";
    role?: "user" | "company";
    href?: string;
}

export default function AccountTypeButton({ label, theme, role, href }: AccountTypeButtonProps) {
    const targetHref = href ?? (role === "company" ? "/register/company" : "/register/user");

    const themeClasses = theme === "blue"
        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-[0.99]"
        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 active:scale-[0.99]";

    return (
        <Button
            nativeButton={false}
            render={<Link href={targetHref} />}
            className={`w-full h-11 px-8 rounded-full font-semibold group transition-all duration-200 cursor-pointer ${themeClasses}`}
        >
            <span className="flex items-center justify-center gap-2">
                <span>{label}</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
        </Button>
    );
}