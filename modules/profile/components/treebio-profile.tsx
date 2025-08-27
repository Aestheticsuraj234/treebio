"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Instagram,
  Youtube,
  Twitter,
  Github,
  Linkedin,
  Globe,
  ExternalLink,
  Share,
  Star,
  Sun,
  Moon,
  ArrowLeft,
  Copy,
  CopyCheck,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { logLinkClick } from "@/modules/analytics/actions";


interface LinkItem {
  id: string;
  title: string;
  url: string;
  description?: string;
  clickCount: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileData {
  id: string;
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
  links: LinkItem[];
  socialLinks: SocialLinkItem[];
}

interface TreeBioProfileProps {
  profileData?: ProfileData;
}

const getSocialIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "instagram":
      return <Instagram className="h-15 w-15" />;
    case "youtube":
      return <Youtube className="h-15 w-15" />;
    case "twitter":
      return <Twitter className="h-15 w-15" />;
    case "github":
      return <Github className="h-15 w-15" />;
    case "linkedin":
      return <Linkedin className="h-15 w-15" />;
    default:
      return <Globe className="h-15 w-15" />;
  }
};

export default function TreeBioProfile({ profileData }: TreeBioProfileProps) {
  const router = useRouter();
  const [isCopied, setIsCopied] = React.useState(false);
  const [linkClicks, setLinkClicks] = React.useState<{ [key: string]: number }>({});
  const { theme, setTheme } = useTheme();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const onCopy = () => {
    if (profileData) {
      navigator.clipboard.writeText(`${origin}/${profileData.username}`);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };


  React.useEffect(() => {
    if (profileData?.links) {
      const initialClicks = profileData.links.reduce((acc, link) => {
        acc[link.id] = link.clickCount;
        return acc;
      }, {} as { [key: string]: number });
      setLinkClicks(initialClicks);
    }
  }, [profileData?.links]);


  const handleLinkClick = async (linkId: string, url: string, event: React.MouseEvent) => {

    try {
      await logLinkClick(linkId);


      setLinkClicks(prev => ({
        ...prev,
        [linkId]: (prev[linkId] || 0) + 1
      }));

      console.log(`Logged click for link: ${linkId}`);
    } catch (error) {
      console.error("Failed to log link click:", error);
    }
  };

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 dark:bg-zinc-900">
        <div className="text-center py-8 text-zinc-400 dark:text-zinc-400">
          Profile not found.
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${theme === "dark" ? "bg-zinc-900" : "bg-gray-50"
        }`}
    >
      {/* Back button */}
      <Button
        variant="outline"
        className={`absolute top-4 left-4 h-10 w-10 rounded-md transition-all duration-200 ${theme === "dark"
          ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
          }`}
        onClick={() => router.back()}
        aria-label="Go back"
      >
        <span className="sr-only">Go back</span>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      {/* Main Profile Card */}
      <div className="w-full max-w-md">
        <Card
          className={`backdrop-blur-sm rounded-2xl shadow-2xl p-8 relative overflow-hidden transition-all duration-300 ${theme === "dark"
            ? "bg-zinc-800/90 border-zinc-700/50"
            : "bg-white/90 border-gray-200/50"
            }`}
        >
          {/* Background gradient overlay */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${theme === "dark"
              ? "bg-gradient-to-br from-zinc-800/20 via-transparent to-zinc-900/20"
              : "bg-gradient-to-br from-gray-50/20 via-transparent to-gray-100/20"
              }`}
          />

          {/* Header with theme toggle and share */}
          <div className="flex justify-between items-center mb-8 relative z-10">
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-xl transition-all duration-200 ${theme === "dark"
                ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={onCopy}
              size="icon"
              className={`h-9 w-9 rounded-xl transition-all duration-200 ${theme === "dark"
                ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                }`}
              aria-label="Share profile"
            >
              {isCopied ? (
                <CopyCheck className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Profile Section */}
          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="relative mb-6">
              <Avatar
                className={`h-28 w-28 border-4 shadow-2xl ring-2 transition-all duration-300 ${theme === "dark"
                  ? "border-zinc-600/30 ring-zinc-500/20"
                  : "border-gray-300/50 ring-gray-400/20"
                  }`}
              >
                <AvatarImage
                  src={profileData.imageUrl || "/placeholder.svg"}
                  alt={`${profileData.firstName} ${profileData.lastName}`}
                />
                <AvatarFallback
                  className={`text-lg font-semibold transition-colors duration-300 ${theme === "dark"
                    ? "bg-zinc-700 text-zinc-100"
                    : "bg-gray-200 text-gray-800"
                    }`}
                >
                  {profileData.firstName[0]}
                  {profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 h-8 w-8 bg-green-500 rounded-full border-4 flex items-center justify-center transition-colors duration-300 ${theme === "dark" ? "border-zinc-800" : "border-white"
                  }`}
              >
                <div className="h-2 w-2 bg-white rounded-full" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1
                className={`text-3xl font-bold tracking-tight transition-colors duration-300 ${theme === "dark" ? "text-zinc-100" : "text-gray-900"
                  }`}
              >
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p
                className={`text-lg font-medium transition-colors duration-300 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"
                  }`}
              >
                @{profileData.username}
              </p>
              <p
                className={`text-base leading-relaxed max-w-sm mx-auto transition-colors duration-300 ${theme === "dark" ? "text-zinc-300" : "text-gray-700"
                  }`}
              >
                {profileData.bio}
              </p>
            </div>
          </div>

          {/* Links Section */}
          <div className="space-y-3 mb-8 relative z-10">
            {profileData.links.map((link, index) => (
              <Button
                key={link.id}
                asChild
                onClick={(event) => handleLinkClick(link.id, link.url, event)}
                variant="outline"
                className={`w-full h-14 text-base font-medium backdrop-blur-sm transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] group ${theme === "dark"
                  ? "border-zinc-600/40 bg-zinc-700/40 text-zinc-100 hover:bg-zinc-600/60 hover:border-zinc-500/60"
                  : "border-gray-300/60 bg-gray-100/40 text-gray-900 hover:bg-gray-200/60 hover:border-gray-400/60"
                  }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-2"
                >
                  <span className="flex-1 text-center truncate px-4">
                    {link.title}
                  </span>
                  <div className="flex items-center space-x-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                    <span
                      className={`text-xs transition-colors duration-300 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"
                        }`}
                    >
                      {link.clickCount}
                    </span>
                    <ExternalLink
                      className={`h-4 w-4 transition-colors duration-300 ${theme === "dark" ? "text-zinc-400" : "text-gray-600"
                        }`}
                    />
                  </div>
                </a>
              </Button>
            ))}
          </div>

          {/* Social Links */}
          {profileData.socialLinks && profileData.socialLinks.length > 0 && (
            <div className="flex justify-center space-x-3 mb-8 relative z-10">
              {profileData.socialLinks.map((socialLink) => (
                <Button
                  key={socialLink.id}

                  asChild
                  variant="ghost"
                  size="icon"
                  className={`h-12 w-12 rounded-xl border transition-all duration-200 hover:scale-110 ${theme === "dark"
                    ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                    }`}
                >
                  <a
                    href={socialLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${socialLink.platform} profile`}
                  >
                    {getSocialIcon(socialLink.platform)}
                  </a>
                </Button>
              ))}
            </div>
          )}

          {/* TreeBio Branding Footer */}
          <div
            className={`flex flex-col items-center space-y-4 pt-6 border-t relative z-10 transition-colors duration-300 ${theme === "dark" ? "border-zinc-700/50" : "border-gray-200/50"
              }`}
          >
            <Button
              variant="outline"
              className={`w-full flex items-center h-12 text-sm font-medium backdrop-blur-sm transition-all duration-200 rounded-xl group ${theme === "dark"
                ? "border-zinc-600/40 bg-zinc-700/30 text-zinc-200 hover:bg-zinc-600/50 hover:border-zinc-500/60"
                : "border-gray-300/60 bg-gray-100/30 text-gray-800 hover:bg-gray-200/50 hover:border-gray-400/60"
                }`}
            >
              <img src="/logo.svg" alt="TreeBio" className="h-10 w-10 mr-2" />
              <span className="group-hover:scale-105 transition-transform duration-200 flex-1 text-center">
                Join {profileData.username} on TreeBio
              </span>
              <Star className="h-4 w-4 ml-2 group-hover:text-yellow-400 transition-colors duration-200" />
            </Button>

            <div
              className={`flex space-x-6 text-xs transition-colors duration-300 ${theme === "dark" ? "text-zinc-500" : "text-gray-500"
                }`}
            >
              <a
                href="#"
                className={`transition-colors duration-200 hover:underline ${theme === "dark"
                  ? "hover:text-zinc-300"
                  : "hover:text-gray-700"
                  }`}
              >
                Report
              </a>
              <a
                href="#"
                className={`transition-colors duration-200 hover:underline ${theme === "dark"
                  ? "hover:text-zinc-300"
                  : "hover:text-gray-700"
                  }`}
              >
                Privacy
              </a>
              <a
                href="#"
                className={`transition-colors duration-200 hover:underline ${theme === "dark"
                  ? "hover:text-zinc-300"
                  : "hover:text-gray-700"
                  }`}
              >
                Terms
              </a>
            </div>
          </div>
        </Card>
      </div>

      {/* Floating elements for visual enhancement */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className={`absolute top-1/4 left-1/4 w-72 h-72 rounded-full blur-3xl transition-colors duration-500 ${theme === "dark" ? "bg-blue-500/5" : "bg-blue-500/10"
            }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl transition-colors duration-500 ${theme === "dark" ? "bg-purple-500/5" : "bg-purple-500/10"
            }`}
        />
      </div>
    </div>
  );
}
