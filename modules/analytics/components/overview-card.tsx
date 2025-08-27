import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Eye, Link, MousePointer, TrendingUp } from "lucide-react"
import { getAnalyticsSummary } from "../actions"

interface OverviewCardsProps {
  userId: string
}

export async function OverviewCards({ userId }: OverviewCardsProps) {
  const summary = await getAnalyticsSummary(userId)

  if (!summary) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-zinc-50 dark:bg-zinc-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">--</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: "Profile Views",
      value: summary.profileVisits?.totalVisits || 0,
      description: `${summary.profileVisits?.visitsLast24Hours || 0} in last 24h`,
      icon: Eye,
      trend: summary.profileVisits?.visitsLast24Hours || 0,
    },
    {
      title: "Total Links",
      value: summary.totalLinks,
      description: "Active links created",
      icon: Link,
      trend: summary.totalLinks,
    },
    {
      title: "Total Clicks",
      value: summary.totalLinkClicks,
      description: "All-time link clicks",
      icon: MousePointer,
      trend: summary.totalLinkClicks,
    },
    {
      title: "Top Link Performance",
      value: summary.topLink?.clickCount || 0,
      description: summary.topLink?.title || "No links yet",
      icon: TrendingUp,
      trend: summary.topLink?.clickCount || 0,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index} className="bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{card.value.toLocaleString()}</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{card.description}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
