"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group z-100 font-sans"
      position="bottom-right"
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />,
        info: <InfoIcon className="size-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
        error: <OctagonXIcon className="size-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />,
        loading: <Loader2Icon className="size-5 text-blue-600 dark:text-blue-400 animate-spin shrink-0 mt-0.5" />,
      }}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            "group toast flex items-start gap-3 rounded-2xl p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-950/10 font-sans transition-all",
          title:
            "text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 group-[.success]:text-emerald-950 group-[.success]:dark:text-emerald-100 group-[.error]:text-rose-950 group-[.error]:dark:text-rose-100 group-[.warning]:text-amber-950 group-[.warning]:dark:text-amber-100 group-[.info]:text-blue-950 group-[.info]:dark:text-blue-100",
          description:
            "text-xs font-medium text-slate-600 dark:text-slate-300 group-[.success]:text-emerald-800 group-[.success]:dark:text-emerald-200 group-[.error]:text-rose-800 group-[.error]:dark:text-rose-200 group-[.warning]:text-amber-800 group-[.warning]:dark:text-amber-200 group-[.info]:text-blue-800 group-[.info]:dark:text-blue-200 mt-0.5 leading-relaxed opacity-100",
          actionButton: "bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl px-3 py-1.5 transition-colors",
          cancelButton: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl px-3 py-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors",
          success: "!bg-emerald-50/95 dark:!bg-emerald-950/90 !border-emerald-200 dark:!border-emerald-800/70",
          error: "!bg-rose-50/95 dark:!bg-rose-950/90 !border-rose-200 dark:!border-rose-800/70",
          warning: "!bg-amber-50/95 dark:!bg-amber-950/90 !border-amber-200 dark:!border-amber-800/70",
          info: "!bg-blue-50/95 dark:!bg-blue-950/90 !border-blue-200 dark:!border-blue-800/70",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }