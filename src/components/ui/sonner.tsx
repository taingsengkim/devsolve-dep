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
      position="top-center"
      icons={{
        success: <CircleCheckIcon className="size-4.5 text-emerald-100 shrink-0" />,
        info: <InfoIcon className="size-4.5 text-sky-200 shrink-0" />,
        warning: <TriangleAlertIcon className="size-4.5 text-amber-200 shrink-0" />,
        error: <OctagonXIcon className="size-4.5 text-rose-200 shrink-0" />,
        loading: <Loader2Icon className="size-4.5 text-emerald-100 animate-spin shrink-0" />,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#059669",
          color: "#ffffff",
          border: "1px solid #10b981",
          borderRadius: "14px",
          boxShadow: "0 8px 20px -4px rgba(5, 150, 105, 0.3)",
          padding: "12px 16px",
        },
        classNames: {
          toast: "flex items-center gap-3 text-sm font-medium tracking-wide",
          title: "text-white font-semibold text-sm",
          description: "text-emerald-100 text-xs mt-0.5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }