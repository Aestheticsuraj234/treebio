"use client"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, Link } from "lucide-react"

const ClaimLinkForm = () => {
  const [origin, setOrigin] = useState("")
  const [linkValue, setLinkValue] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
    }
  }, [])

  useEffect(() => {
    if (linkValue.trim()) {
      const timer = setTimeout(() => {
        // Simulate availability check
        setIsChecking(true)
        setTimeout(() => {
          setIsAvailable(true) // Simulate available
          setIsChecking(false)
        }, 500)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setIsAvailable(null)
    }
  }, [linkValue])

  const handleSubmit = () => {
    if (linkValue.trim()) {
      console.log("Claiming link:", `${origin}/${linkValue}`)
      // Add your claim logic here
    }
  }

  const displayOrigin = origin ? origin.replace("https://", "").replace("http://", "") : "treebio.com"

  return (
    <div className="space-y-8 max-w-md mx-auto w-full">
      {/* Form */}
      <form
        className="space-y-6 flex flex-col items-center"
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="w-full">
          <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden transition-all bg-white dark:bg-neutral-900">
            <div className="flex items-center px-4 py-3 bg-neutral-50 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
              <span className="text-sm text-neutral-600 dark:text-neutral-300 font-medium">{displayOrigin}/</span>
            </div>
            <div className="flex-1 relative flex items-center">
              <Input
                type="text"
                placeholder="yourname"
                value={linkValue}
                onChange={(e) => setLinkValue(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))}
                maxLength={30}
                className="h-12 px-3 border-0 shadow-none focus:ring-0 focus:outline-none bg-transparent text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              />
              {linkValue && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isChecking ? (
                    <div className="w-4 h-4 border-2 border-neutral-300 dark:border-neutral-600 border-t-black dark:border-t-white rounded-full animate-spin" />
                  ) : isAvailable ? (
                    <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
                  ) : (
                    <div className="w-4 h-4 bg-red-500 dark:bg-red-600 rounded-full" />
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Availability Message */}
          {linkValue && !isChecking && (
            <div className="mt-2 text-sm">
              {isAvailable ? (
                <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {displayOrigin}/{linkValue} is available!
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400">This link is already taken</span>
              )}
            </div>
          )}
        </div>
        <Button
          type="submit"
          disabled={!linkValue.trim() || !isAvailable}
          className="w-full h-12 text-base font-medium"
          size="lg"
        >
          Claim your TreeBio
        </Button>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center w-full">
          By continuing, you agree to TreeBio's Terms of Service and Privacy Policy.
        </p>
      </form>
      {/* Preview */}
      {linkValue && isAvailable && (
        <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <div className="text-sm text-neutral-600 dark:text-neutral-300 mb-2">Your link will be:</div>
          <div className="font-mono text-sm bg-white dark:bg-neutral-800 p-2 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100">
            {displayOrigin}/{linkValue}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClaimLinkForm
