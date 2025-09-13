"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Instagram, Youtube, Mail } from "lucide-react"


const socialLinkSchema = z.object({
  platform: z.enum(["instagram", "youtube", "email"], {
    error: "Please select a platform.",
  }),
  url: z.string().url("Please enter a valid URL").min(1, "URL is required"),
})

export type SocialLinkFormData = z.infer<typeof socialLinkSchema>

interface SocialLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: SocialLinkFormData) => void
  defaultValues?: SocialLinkFormData
}

export const SocialLinkModal: React.FC<SocialLinkModalProps> = ({ isOpen, onClose, onSubmit, defaultValues }) => {
  const form = useForm<SocialLinkFormData>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: defaultValues || { platform: "instagram", url: "" },
  })

  React.useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    } else {
      form.reset({ platform: "instagram", url: "" }) // Reset to default when opening for new link
    }
  }, [defaultValues, form, isOpen])

  const handleSubmit = (data: SocialLinkFormData) => {
    onSubmit(data)
    form.reset()
    onClose()
  }

  const socialPlatforms = [
    { value: "instagram", label: "Instagram", icon: Instagram },
    { value: "youtube", label: "YouTube", icon: Youtube },
    { value: "email", label: "Email", icon: Mail },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
          <DialogDescription>
            {defaultValues
              ? "Edit the details of your social link."
              : "Add a new social media or contact link to your profile."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="platform" className="text-right">
              Platform
            </Label>
            <Select
              onValueChange={(value) => form.setValue("platform", value as "instagram" | "youtube" | "email")}
              defaultValue={form.getValues("platform")}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>
                {socialPlatforms.map((platform) => (
                  <SelectItem key={platform.value} value={platform.value}>
                    <div className="flex items-center gap-2">
                      <platform.icon size={16} /> {platform.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.platform && (
              <p className="col-span-4 text-right text-sm text-red-500">{form.formState.errors.platform.message}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              placeholder="https://example.com/profile"
              className="col-span-3"
              {...form.register("url")}
            />
            {form.formState.errors.url && (
              <p className="col-span-4 text-right text-sm text-red-500">{form.formState.errors.url.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{defaultValues ? "Save Changes" : "Add Social Link"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
