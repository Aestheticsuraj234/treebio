"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Share,
  X,
  Copy,
  ListFilter,
  QrCode,
  ExternalLink,
  ChevronRight,
  Check,
} from "lucide-react";

import { Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { set } from "zod";

const ShareMenu = ({ username }: { username: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const fullLink = `${origin}/${username}`;

  const handleCopy = () => {
   setIsCopied(true);
   navigator.clipboard.writeText(fullLink)
   setTimeout(() => {
     setIsCopied(false);
   }, 2000);
   toast.success("Link copied to clipboard!");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="default" >
            <Share className="h-4 w-4" />   Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4">
        <div className="flex items-center justify-between mb-4">
          <DropdownMenuLabel className="text-lg font-semibold">
            Share your Linktree
          </DropdownMenuLabel>
       
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Get more visitors by sharing your Linktree everywhere.
        </p>
        <div className="flex w-full items-center space-x-2 mb-4">
          <Input type="text" value={fullLink} readOnly className="flex-1" />
          <Button type="button" onClick={handleCopy}>
            {isCopied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <Button
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 h-auto"
          >
            <ListFilter className="mr-2 h-4 w-4" />
            Add to bio
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Button
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 h-auto"
          >
            <QrCode className="mr-2 h-4 w-4" />
            QR code
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Button
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 h-auto"
          >
            <Share className="mr-2 h-4 w-4" />
            Share to...
            <ChevronRight className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem className="p-0">
          <Button
            variant="ghost"
            className="w-full justify-start px-2 py-1.5 h-auto"
          >
            <Globe className="mr-2 h-4 w-4" />
            Open
            <ExternalLink className="ml-auto h-4 w-4" />
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareMenu;
