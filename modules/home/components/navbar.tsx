import { Button } from "@/components/ui/button"

import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { SignedIn, SignedOut } from "@clerk/nextjs"

import Link from "next/link"
import Image from "next/image"
import { ModeToggle } from "@/components/theme-toggle"
import UserControl from "./user-control"

export const Navbar = () => {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-200 hover:bg-white/15 dark:hover:bg-black/15">
        <div className="px-6 py-4 flex justify-between items-center">
          <Link href={"/"} className="flex items-center gap-2">
            <Image src={"/logo.svg"} alt="TreeBio" width={42} height={42} />
            <span className="font-bold text-2xl tracking-widest text-[#41B313]">TreeBio</span>
          </Link>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <SignedIn>
              <UserControl 
               />
            </SignedIn>
            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm font-medium hover:bg-white/20 dark:hover:bg-white/10"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm" className="text-sm font-medium bg-[#41B313] hover:bg-[#369611] text-white">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  )
}
