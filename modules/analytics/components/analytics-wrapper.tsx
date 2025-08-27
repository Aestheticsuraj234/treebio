
import { getDailyProfileVisits } from "../actions"
import { ProfileVisitsChart } from "./profile-visit-chart"


interface AnalyticsWrapperProps {
  userId: string 
}

export async function AnalyticsWrapper({ userId }: AnalyticsWrapperProps) {
  const dailyVisits = await getDailyProfileVisits(userId, 30)

  return <ProfileVisitsChart data={dailyVisits} />
}
