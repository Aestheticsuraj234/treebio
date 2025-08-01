"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Instagram,
  Youtube,
  Mail,
  ExternalLink,
  Grip,
  Archive,
  FolderPlus,
  Camera,
  Trash2,
  Edit3,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { createUserProfile } from "@/modules/profile/actions";
import { createLinkByUser } from "../actions";
import { LinkCard, LinkFormWithPreview } from "./link-card";

// Zod schemas
const profileSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .max(50, "Last name must be less than 50 characters")
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  imageUrl: z.string().url("Please enter a valid image URL").optional(),
});

const linkSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  url: z.string().url("Please enter a valid URL").min(1, "URL is required"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional(),
});

const socialLinkSchema = z.object({
  platform: z.enum(["instagram", "youtube", "email"]),
  url: z.string().url("Please enter a valid URL"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type LinkFormData = z.infer<typeof linkSchema>;
export type SocialLinkFormData = z.infer<typeof socialLinkSchema>;

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  clickCount: number;
}

interface Profile {
  firstName: string;
  lastName: string;
  username: string;
  bio?: string;
  imageUrl?: string;
}

interface Props{
  username:string;
  bio:string;
  link:{
       id:string,
            title:string,
            description:string,
            url:string,
            clickCount:number,
            createdAt:Date
  }[]
}

const LinkForm = ({ username, bio , link}: Props) => {
  const currentUser = useUser();

  const [isAddingLink, setIsAddingLink] = React.useState(false);
  const [editingProfile, setEditingProfile] = React.useState(false);
  const [links, setLinks] = React.useState<Link[]>(link || []);
  const [profile, setProfile] = React.useState<Profile>({
    firstName: currentUser.user?.firstName || "",
    lastName: currentUser.user?.lastName || "",
    username: username || "",
    bio: bio || "",
    imageUrl:
      currentUser.user?.imageUrl ||
      `https://avatar.iran.liara.run/username?username=[${currentUser.user?.firstName}+${currentUser.user?.lastName}]`,
  });

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      username: profile.username,
      bio: profile.bio || "",
    },
  });

  // Link form
  const linkForm = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
    },
  });

  // Social link form
  const socialLinkForm = useForm<SocialLinkFormData>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: "instagram",
      url: "",
    },
  });

  // Profile submit handler
  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setProfile((prev) => ({ ...prev, ...data }));

      const updatedProfile = await createUserProfile(data);

      console.log("Updated Profile:", updatedProfile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      profileForm.reset();
      setEditingProfile(false);
    }
  };

  // Link submit handler
  const onLinkSubmit = async (data: LinkFormData) => {
    try {
      const link = await createLinkByUser(data);
      console.log("Created Link:", link);

      if (link?.data?.id) {
        setLinks((prev) => [
          ...prev,
          { id: link.data.id, ...data, clickCount: 0 },
        ]);
      }
      toast.success("Link created successfully!");
    } catch (error) {
      console.error("Something Went wrong", error);
      toast.error("Failed to create link.");
    } finally {
      linkForm.reset();
      setIsAddingLink(false);
    }
  };

  // Social link submit handler
  const onSocialLinkSubmit = (data: SocialLinkFormData) => {
    console.log("Social Link Data:", data);
    toast.success(`${data.platform} link added successfully!`);
  };

  // Delete link handler
  const handleDeleteLink = (linkId: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== linkId));
    toast.success("Link deleted successfully!");
  };

  // Edit link handler
  const handleEditLink = (linkId: string) => {
    const link = links.find((l) => l.id === linkId);
    if (link) {
      linkForm.setValue("title", link.title);
      linkForm.setValue("url", link.url);
      linkForm.setValue("description", link.description || "");
      setIsAddingLink(true);
      // Remove the old link
      setLinks((prev) => prev.filter((l) => l.id !== linkId));
    }
  };

  const socialLinks = [
    { platform: "instagram" as const, icon: Instagram },
    { platform: "youtube" as const, icon: Youtube },
    { platform: "email" as const, icon: Mail },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Profile Section */}
      <Card className="border-2 border-dashed border-gray-200 hover:border-green-400 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarImage
                  src={profile.imageUrl || "/placeholder.svg"}
                  alt={profile.username}
                />
                <AvatarFallback className="text-lg font-semibold bg-gray-100 text-gray-600">
                  {profile.username.slice(0, 2).toUpperCase() || "UN"}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={14} />
              </Button>
            </div>

            <div className="flex-1 space-y-2">
              {editingProfile ? (
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-2"
                >
                  <div className="flex gap-2">
                    <Input
                      {...profileForm.register("firstName")}
                      placeholder="First Name"
                    />
                    <Input
                      {...profileForm.register("lastName")}
                      placeholder="Last Name"
                    />
                  </div>
                  <div>
                    <Input
                      {...profileForm.register("username")}
                      placeholder="Username"
                      className="font-semibold cursor-not-allowed"
                      readOnly
                      disabled
                    />
                    {profileForm.formState.errors.username && (
                      <p className="text-sm text-red-500 mt-1">
                        {profileForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Textarea
                      {...profileForm.register("bio")}
                      placeholder="Add bio..."
                      className="resize-none"
                      rows={2}
                    />
                    {profileForm.formState.errors.bio && (
                      <p className="text-sm text-red-500 mt-1">
                        {profileForm.formState.errors.bio.message}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      type="submit"
                      disabled={profileForm.formState.isSubmitting}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => setEditingProfile(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">
                      {profile.username || "Add username..."}
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => setEditingProfile(true)}
                    >
                      <Edit3 size={12} />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {profile.bio || "Add bio..."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-4 flex gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Button
                  key={social.platform}
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0 bg-transparent"
                  onClick={() => {
                    socialLinkForm.setValue("platform", social.platform);
                    // In a real app, you'd open a modal or form here
                    const url = prompt(`Enter your ${social.platform} URL:`);
                    if (url) {
                      onSocialLinkSubmit({ platform: social.platform, url });
                    }
                  }}
                >
                  <Icon size={16} />
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 border-dashed bg-transparent"
            >
              <Plus size={16} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Links Section */}
      <div className="space-y-3">
        {links.map((link, index) => (
         <LinkCard key={link.id} link={link} onDelete={()=>{}} onEdit={()=>{}}/>
        ))}

        {/* Add New Link */}
        {isAddingLink ? (
         <LinkFormWithPreview 
         onCancel={() => setIsAddingLink(false)}
         onSubmit={onLinkSubmit}
         defaultValues={{
           title: "",
           url: "",
           description: "",
         }}
         
         />
        ) : (
          <Button
            onClick={() => setIsAddingLink(true)}
            className="w-full h-12 border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 dark:text-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
            variant="outline"
          >
            <Plus size={20} className="mr-2" />
            Add Link
          </Button>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          <FolderPlus size={16} />
          Add Collection
        </Button>

        <Button
          variant="outline"
          className="flex items-center gap-2 bg-transparent"
        >
          <Archive size={16} />
          View Archive
        </Button>
      </div>
    </div>
  );
};

export default LinkForm;
