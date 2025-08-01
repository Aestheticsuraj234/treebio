"use client";
import {
  TreesIcon as Tree,
  BarChart3,
  Settings,
  QrCode,
  TrendingUp,
  Link2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Main navigation items
const mainNavItems = [
  {
    title: "My Tree",
    url: "/admin/my-tree",
    icon: Tree,
  },
  {
    title: "Overview",
    url: "/admin/overview",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

// Tools section
const toolsItems = [
  {
    title: "QR Code Generator",
    url: "/admin/tools/qr-code",
    icon: QrCode,
  },
  {
    title: "Link Shortener",
    url: "/admin/tools/shortener",
    icon: Link2,
  },
  {
    title: "Analytics",
    url: "/admin/tools/analytics",
    icon: TrendingUp,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={"/"} className="flex gap-2 items-center justify-start p-4 ">
          <Image src={"/logo.svg"} alt="TreeBio Logo" width={32} height={32} />
          <h1 className="text-lg font-bold text-zinc-700 dark:text-zinc-100">
            TreeBio Admin
          </h1>
        </Link>
        <SidebarSeparator />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size={"lg"}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <>
                        <item.icon className="size-6 " />
                        <span className="font-semibold text-base">
                          {item.title}
                        </span>
                      </>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size={"lg"}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon className="size-6" />
                      <span className="font-semibold text-base">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
