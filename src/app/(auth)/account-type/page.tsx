import React from "react";
import Link from "next/link";
import {
    ShieldCheck,
    Lock,
    Trophy,
    Users,
    PlusCircle,
    Inbox,
    BarChart3,
    UserCheck,
    User,
    Building2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AccountTypeButton from "./AccountTypeButton";

export default function AccountTypeSelectionPage() {
    const userFeatures = [
        { icon: ShieldCheck, text: "Discover and report bug bounty programs" },
        { icon: Lock, text: "Access private and public programs" },
        { icon: Trophy, text: "Build your reputation and earn rewards" },
        { icon: Users, text: "Connect with a global security community" },
    ];

    const companyFeatures = [
        { icon: PlusCircle, text: "Create and manage bug bounty programs" },
        { icon: Inbox, text: "Receive and triage vulnerability reports" },
        { icon: BarChart3, text: "Track program performance & metrics" },
        { icon: UserCheck, text: "Manage your team and submissions" },
    ];

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex flex-col justify-center items-center px-4 py-12">
            {/* Header */}
            <div className="text-center mb-10 max-w-md">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Choose your account type
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Select how you want to use DevSolve and get started
                </p>
            </div>

            {/* Cards Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">

                {/* User Card */}
                <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-8 flex flex-col items-center text-center h-full justify-between">
                        <div className="w-full">
                            <div className="w-24 h-24 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-6">
                                <div className="w-16 h-16 rounded-full bg-blue-100/80 flex items-center justify-center">
                                    <User className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-blue-600 mb-6">
                                I&#39;m a User
                            </h2>

                            <ul className="space-y-4 text-left text-sm text-slate-600 mb-8 w-full max-w-[280px] mx-auto">
                                {userFeatures.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={index} className="flex items-start gap-3">
                                            <Icon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                            <span>{item.text}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Injected Client Component */}
                        <AccountTypeButton label="Continue as User" role="user" theme="blue" />
                    </CardContent>
                </Card>

                {/* Company Card */}
                <Card className="border border-slate-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-8 flex flex-col items-center text-center h-full justify-between">
                        <div className="w-full">
                            <div className="w-24 h-24 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-6">
                                <div className="w-16 h-16 rounded-full bg-emerald-100/80 flex items-center justify-center">
                                    <Building2 className="w-8 h-8 text-emerald-600" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-emerald-600 mb-6">
                                I&#39;m a Company
                            </h2>

                            <ul className="space-y-4 text-left text-sm text-slate-600 mb-8 w-full max-w-[280px] mx-auto">
                                {companyFeatures.map((item, index) => {
                                    const Icon = item.icon;
                                    return (
                                        <li key={index} className="flex items-start gap-3">
                                            <Icon className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>{item.text}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Injected Client Component */}
                        <AccountTypeButton label="Continue as Company" role="company" theme="emerald" />
                    </CardContent>
                </Card>

            </div>

            {/* Footer Link */}
            <p className="mt-12 text-sm text-slate-500">
                Not sure which one to choose?{" "}
                <Link href="" className="text-blue-600 hover:underline font-medium">
                    Learn more
                </Link>
            </p>
        </div>
    );
}