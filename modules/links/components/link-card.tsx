"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Grip,
  Edit3,
  Trash2,
  ExternalLink,
  Globe,
  Loader2,
} from "lucide-react";
import { useOGData } from "@/hooks/useOgData";
import { cn } from "@/lib/utils";

interface LinkCardProps {
  link: {
    id: string;
    title: string;
    url: string;
    description?: string;
    clickCount: number;
  };
  onEdit: (linkId: string) => void;
  onDelete: (linkId: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  onEdit,
  onDelete,
}) => {
  const { data: ogData, loading, error } = useOGData(link.url);

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border hover:border-purple-200">
      <CardContent >
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1"
          >
            <Grip size={14} />
          </Button>

          {/* OG Image */}
          <div className="flex-shrink-0">
            {loading ? (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <Loader2 size={16} className="animate-spin text-gray-400" />
              </div>
            ) : ogData?.image ? (
              <img
                src={ogData.image || "/placeholder.svg"}
                alt={ogData.title || link.title}
                className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.classList.remove("hidden");
                }}
              />
            ) : null}

            {/* Fallback favicon or icon */}
            {(!ogData?.image || error) && !loading && (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                {ogData?.favicon ? (
                  <img
                    src={ogData.favicon || "/placeholder.svg"}
                    alt="Favicon"
                    className="w-6 h-6"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <Globe
                  size={20}
                  className={`text-gray-400 ${ogData?.favicon ? "hidden" : ""}`}
                />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium truncate">
                {link.title || ogData?.title}
              </h4>
              <Badge variant="secondary" className="text-xs flex-shrink-0">
                {link.clickCount} clicks
              </Badge>
            </div>

            {/* Description from OG data or user input */}
            {(ogData?.description || link.description) && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-1">
                {ogData?.description || link.description}
              </p>
            )}

            {/* Site name and URL */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {ogData?.siteName && (
                <>
                  <span className="font-medium">{ogData.siteName}</span>
                  <span>•</span>
                </>
              )}
              <span className="truncate">{link.url}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onEdit(link.id)}
            >
              <Edit3 size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
              onClick={() => onDelete(link.id)}
            >
              <Trash2 size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => window.open(link.url, "_blank")}
            >
              <ExternalLink size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Link Form Component
interface LinkFormWithPreviewProps {
  onSubmit: (data: {
    title: string;
    url: string;
    description?: string;
  }) => void;
  onCancel: () => void;
  defaultValues?: {
    title: string;
    url: string;
    description?: string;
  };
}

export const LinkFormWithPreview: React.FC<LinkFormWithPreviewProps> = ({
  onSubmit,
  onCancel,
  defaultValues,
}) => {
  const [isPending, setIsPending] = React.useState(false);
  const [url, setUrl] = React.useState(defaultValues?.url || "");
  const [title, setTitle] = React.useState(defaultValues?.title || "");
  const [description, setDescription] = React.useState(
    defaultValues?.description || ""
  );

  const { data: ogData, loading } = useOGData(url);

  // Auto-fill form fields when OG data is loaded
  React.useEffect(() => {
    if (ogData && !defaultValues) {
      if (ogData.title && !title) {
        setTitle(ogData.title);
      }
      if (ogData.description && !description) {
        setDescription(ogData.description);
      }
    }
  }, [ogData, title, description, defaultValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    onSubmit({ title, url, description });
    setIsPending(false);
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="bg-white"
              required
            />
          </div>

          {/* Preview */}
          {url && (
            <div className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-start gap-3">
                {loading ? (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <Loader2 size={16} className="animate-spin text-gray-400" />
                  </div>
                ) : ogData?.image ? (
                  <img
                    src={ogData.image || "/placeholder.svg"}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded bg-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                    <Globe size={16} className="text-gray-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {ogData?.title || "Loading..."}
                  </p>
                  {ogData?.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {ogData.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 truncate">
                    {ogData?.siteName || (url ? new URL(url).hostname : "")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="link-title">Link Title</Label>
            <Input
              id="link-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter link title..."
              className="bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-description">Description (optional)</Label>
            <Input
              id="link-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..."
              className="bg-white"
            />
          </div>

          <div className="flex gap-2">
            <Button size="sm" type="submit" className={cn(isPending && "pointer-events-none bg-black/20")} >
              {defaultValues ? "Update Link" : "Add Link"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
