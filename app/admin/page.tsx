import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Eye, MousePointer, Users } from "lucide-react"

const Page = () => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">Manage your links and track your performance</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Link
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Links</CardTitle>
            <CardDescription>Your most recently added links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Instagram Profile</p>
                  <p className="text-xs text-muted-foreground">instagram.com/username</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">234 clicks</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="space-y-1">
                  <p className="text-sm font-medium">YouTube Channel</p>
                  <p className="text-xs text-muted-foreground">youtube.com/channel</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">156 clicks</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Portfolio Website</p>
                  <p className="text-xs text-muted-foreground">myportfolio.com</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">89 clicks</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your Linktree efficiently</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add New Link
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Preview My Tree
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Share My Tree
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Page
