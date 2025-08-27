import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { ExternalLink, MousePointer } from "lucide-react"
import { getTopLinks } from "../actions"

interface TopLinksTableProps {
  userId: string
}

export async function TopLinksTable({ userId }: TopLinksTableProps) {
  const topLinks = await getTopLinks(userId, 5)

  if (!topLinks || topLinks.length === 0) {
    return (
      <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">Top Performing Links</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">Your most clicked links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">No links created yet</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-100">Top Performing Links</CardTitle>
        <CardDescription className="text-zinc-600 dark:text-zinc-400">Your most clicked links</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topLinks.map((link, index) => (
            <div
              key={link.id}
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{link.title}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{link.url}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="flex items-center space-x-1 text-zinc-600 dark:text-zinc-400">
                  <MousePointer className="h-3 w-3" />
                  <span className="text-sm font-medium">{link.clickCount.toLocaleString()}</span>
                </div>
                <ExternalLink className="h-3 w-3 text-zinc-400 dark:text-zinc-500" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
