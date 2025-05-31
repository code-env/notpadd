"use client"

import { siteConfig } from "@/lib/site"
import { Icons } from "@workspace/ui/components/icons"
import { ArrowLeft } from "lucide-react"
import { ReactNode } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
interface AuthLayoutProps {
  children: ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const router = useRouter()
  return (
    <div className="min-h-screen flex">
      <div className="flex-[1] hidden md:flex border-r border-border/50 p-20 justify-center flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Icons.logo className="size-10" />
            <p className="text-2xl font-bold">{siteConfig.name}</p>
          </div>
          <p className="text-lg text-muted-foreground">Write the content not the code.</p>
        </div>
        <div className="flex flex-col gap-2"></div>
      </div>
      <div className="bg-muted/50 flex-[3] flex items-center justify-center relative min-h-screen h-full">
        <Link
          className="absolute flex top-10 left-10 w-fit items-center gap-2 border outline-none py-2 px-4 rounded-md text-sm hover:bg-muted/50 transition-all duration-300"
          href="/"
        >
          <ArrowLeft className="size-4" />
          <span>Home</span>
        </Link>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
