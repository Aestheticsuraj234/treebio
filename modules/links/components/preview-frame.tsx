import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ExternalLink, Star, Globe } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

// Types
interface Link {
  id: string;
  title: string;
  description?: string;
  url: string;
  clickCount: number;
  createdAt: Date;
  user: {
    firstName?: string;
    lastName?: string;
    username?: string;
    bio?: string;
    imageUrl?: string;
  };
}

interface PreviewFrameProps {
  links: Link[];
}

// Component for individual link (now without OG data for server component)
const LinkPreviewItem = ({ link }: { link: Link }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
          <Globe size={12} className="text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 truncate">
            {link.title}
          </p>
          {link.description && (
            <p className="text-xs text-gray-500 truncate">{link.description}</p>
          )}
        </div>
        <ExternalLink size={14} className="text-gray-400 flex-shrink-0" />
      </div>
    </div>
  );
};

const PreviewFrame = async ({ links }: PreviewFrameProps) => {
  const user = await currentUser();

  // Get user profile data from links or fallback to Clerk user
  const userProfile = links[0]?.user || {};
  const displayName =
    userProfile.username ||
    `${userProfile.firstName || ""}${
      userProfile.lastName ? " " + userProfile.lastName : ""
    }`.trim() ||
    user?.firstName ||
    "User";

  const userBio = userProfile.bio || "";
  const userAvatar = userProfile.imageUrl || user?.imageUrl || "";

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Mobile Frame */}
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-[280px] h-[580px] bg-zinc-700 rounded-[2.5rem] p-2 shadow-2xl">
          {/* Screen */}
          <div className="w-full h-full bg-gray-50 rounded-[2rem] overflow-hidden relative">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-transparent flex items-center justify-center">
              <div className="w-20 h-1 bg-zinc-700 rounded-full"></div>
            </div>

            {/* Content */}
            <div className="pt-8 pb-4 px-4 h-full flex flex-col">
              {/* Profile Section */}
              <div className="flex flex-col items-center text-center space-y-3 mb-6">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={userAvatar} alt={displayName} />
                  <AvatarFallback className="text-lg font-semibold bg-gray-200 text-gray-600">
                    {displayName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-lg text-gray-900">
                    {displayName}
                  </h2>
                  {userBio && (
                    <p className="text-sm text-gray-600 mt-1">{userBio}</p>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {links.map((link) => (
                  <LinkPreviewItem key={link.id} link={link} />
                ))}

                {/* Empty State */}

                {links.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No links added yet</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Add some links to see them here
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="bg-white rounded-lg border border-gray-200 p-2 mb-3">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <Star size={12} />
                    <span>Join {displayName.toLowerCase()} on TreeBio</span>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <button className="hover:text-gray-700">Report</button>
                  <span>•</span>
                  <button className="hover:text-gray-700">Privacy</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewFrame;
