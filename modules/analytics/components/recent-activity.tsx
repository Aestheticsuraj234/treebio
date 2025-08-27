import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Clock, Globe } from "lucide-react"
import { getRecentProfileVisitors } from "../actions"

interface RecentActivityProps {
  userId: string
}

export async function RecentActivity({ userId }: RecentActivityProps) {
  const recentVisitors = await getRecentProfileVisitors(userId, 10)

  if (!recentVisitors || recentVisitors.length === 0) {
    return (
      <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">Recent Activity</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">Latest profile visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">No recent activity</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-100">Recent Activity</CardTitle>
        <CardDescription className="text-zinc-600 dark:text-zinc-400">Latest profile visitors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentVisitors.map((visitor, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-md bg-zinc-100 dark:bg-zinc-800">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Globe className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{visitor.visitorIp}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-zinc-500 dark:text-zinc-400">
                <Clock className="h-3 w-3" />
                <span className="text-xs">{new Date(visitor.visitedAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
