import { Button } from "@/components/ui/button";
import { onBoardUser } from "@/modules/auth/actions";
import ClaimLinkForm from "@/modules/home/components/cliam-link-form";
import { getCurrentUsername } from "@/modules/profile/actions";

import { UserButton } from "@clerk/nextjs";
import { get } from "http";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await onBoardUser();
  const profile = await getCurrentUsername();
  

  if (!user.success) {
    return redirect("/sign-in");
  }

 
   
  

 

  return (
    <div className="min-h-screen ">
      {/* Header */}

      {/* Main Content */}
      <main className="flex flex-col max-w-4xl mx-auto px-6">
        <section className="text-center space-y-8 py-32">
          {/* Hero Text */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-zinc-700 dark:text-zinc-100">
              Everything you are.
              <br />
              <span className="text-[#41B313]">In one simple link.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Join 70M+ people using TreeBio for their link in bio. One link to
              help you share everything you create, curate and sell from your
              social media profiles.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            {
              user.success && profile?.username && (
                <Link href="/admin/my-tree">
                  <Button size="lg" className="px-8 py-3 text-lg font-medium cursor-pointer">
                    TreeBio Dashboard
                  </Button>
                </Link>
              )
            }
           
          </div>
        </section>

        {/* Claim Link Section */}
        <section className="pb-16 md:pb-24">
          <div className="max-w-md mx-auto">
            <ClaimLinkForm />
          </div>
        </section>
      </main>
    </div>
  );
}
