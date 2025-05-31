"use client"

import React from "react"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import Image from "next/image"
import demoLight from "@/public/show-case/demo-light.png"
import demoDark from "@/public/show-case/demo-dark.png"
import water from "@/public/show-case/watercolor-2.webp"
import Link from "next/link"

const Hero = () => {
  return (
    <div className="mx-auto mt-16 py-20 w-full px-4 text-center gap-10 flex flex-col border-b border-border/50 overflow-y-hidden relative">
      <div className="flex flex-col gap-y-5 items-center">
        <h1 className="md:text-5xl text-4xl lg:text-6xl font-bold font-lora text-center">
          Build-time content <span className="block">runtime speed</span>
        </h1>
        <p className="md:text-lg text-base max-w-xl mx-auto text-muted-foreground">
          Notpadd is a fast build-time tool that pre-generates content, eliminating slow data
          fetching for a smoother, high-performance site.
        </p>
        <div className="flex gap-x-4">
          <Link href="/sign-in" className={buttonVariants()}>
            Get Started
          </Link>
          <Link href="/sign-in" className={buttonVariants({ variant: "secondary" })}>
            Book a Demo
          </Link>
        </div>
      </div>
      <div className="-mb-24 mt max-w-5xl w-full h-[600px] border border-border/50 mx-auto backdrop-blur relative shadow-xl rounded-t-3xl">
        <div className="w-full h-full relative overflow-hidden rounded-t-3xl bg-background p-2">
          <div className="size-full relative rounded-t-2xl overflow-hidden border">
            <Image
              placeholder="blur"
              src={demoLight}
              alt="Hero"
              fill
              className="block dark:hidden"
            />
            <Image
              placeholder="blur"
              src={demoDark}
              alt="Hero"
              fill
              className="hidden dark:block"
            />
          </div>
        </div>
        <Image
          placeholder="blur"
          src={water}
          alt="Hero"
          height={500}
          width={500}
          className="object-contain -z-10 absolute -bottom-10 -right-60"
        />
        <Image
          placeholder="blur"
          src={water}
          alt="Hero"
          height={500}
          width={500}
          className="object-contain -z-10 absolute -bottom-10 -left-64"
        />
      </div>
    </div>
  )
}

export default Hero
