import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
    return (
        <div className={"min-h-screen flex items-center justify-center"}>
            <Link href={"/account-type"}  className={`${buttonVariants({variant: "link"})} font-bold text-lg`}>Create Account</Link>
        </div>
    )
}