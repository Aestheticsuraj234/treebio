"use server";

import { db } from "@/lib/db";
import { headers } from "next/headers";
import { normalizeIP } from "../utils";

export const logProfileVist = async (userId: string, visitorIp?: string) => {
  const headerList = await headers();

  const ip =
    visitorIp ||
    headerList.get("x-real-ip") ||
    headerList.get("x-forwarded-for") ||
    headerList.get("cf-connecting-ip");

  const recentVisit = await db.profileAnalytics.findFirst({
    where: {
      userId: userId,
      visitorIp: ip!,
      visitedAt: {
        gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      },
    },
  });

  if (!recentVisit) {
    const profileVisit = await db.profileAnalytics.create({
      data: {
        visitorIp: ip!,
        userId: userId,
      },
    });
    return profileVisit;
  }
};

export const getProfileVistCount = async (userId: string) => {
  try {
    // Total visits
    const totalVisits = await db.profileAnalytics.count({
      where: { userId }
    });

    // Last 1 hour
    const visitsLast1Hour = await db.profileAnalytics.count({
      where: {
        userId,
        visitedAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000)
        }
      }
    });

    // Last 24 hours
    const visitsLast24Hours = await db.profileAnalytics.count({
      where: {
        userId,
        visitedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    // Last 7 days
    const visitsLast7Days = await db.profileAnalytics.count({
      where: {
        userId,
        visitedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Last 30 days
    const visitsLast30Days = await db.profileAnalytics.count({
      where: {
        userId,
        visitedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Unique visitors (based on IP)
    const uniqueVisitors = await db.profileAnalytics.groupBy({
      by: ['visitorIp'],
      where: { userId },
      _count: {
        id: true
      }
    });

    return {
      totalVisits,
      visitsLast1Hour,
      visitsLast24Hours,
      visitsLast7Days,
      visitsLast30Days,
      uniqueVisitors: uniqueVisitors.length
    };
  } catch (error) {
    console.error("Error fetching profile visit count:", error);
    return null;
  }
};

// Get daily visits for the last 30 days (for charts)
export const getDailyProfileVisits = async (userId: string, days: number = 30) => {
  try {
    const visits = await db.profileAnalytics.findMany({
      where: {
        userId,
        visitedAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      },
      select: {
        visitedAt: true
      },
      orderBy: {
        visitedAt: 'desc'
      }
    });

    // Group by date
    const dailyVisits = visits.reduce((acc, visit) => {
      const date = visit.visitedAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format for charts
    const chartData = Object.entries(dailyVisits)
      .map(([date, count]) => ({
        date,
        visits: count
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return chartData;
  } catch (error) {
    console.error("Error fetching daily profile visits:", error);
    return null;
  }
};

// Get recent visitors
export const getRecentProfileVisitors = async (userId: string, limit: number = 10) => {
  try {
    const recentVisitors = await db.profileAnalytics.findMany({
      where: { userId },
      orderBy: { visitedAt: 'desc' },
      take: limit,
      select: {
        visitedAt: true,
        visitorIp: true
      }
    });

    return recentVisitors;
  } catch (error) {
    console.error("Error fetching recent profile visitors:", error);
    return null;
  }
};

// Get comprehensive user analytics (profile + links)
export const getUserAnalytics = async (userId: string) => {
  try {
    // Profile analytics
    const profileAnalytics = await getProfileVistCount(userId);

    // Get user's links
    const userLinks = await db.link.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        clickCount: true,
        createdAt: true
      }
    });

    // Get total link clicks
    const totalLinkClicks = userLinks.reduce((sum, link) => sum + link.clickCount, 0);

    // Get link analytics for each link
    const linkAnalytics = await Promise.all(
      userLinks.map(async (link) => {
        const analytics = await getLinkAnalytics(link.id);
        return {
          linkId: link.id,
          title: link.title,
          ...analytics
        };
      })
    );

    // Most clicked link
    const mostClickedLink = userLinks.reduce((max, link) => 
      link.clickCount > (max?.clickCount || 0) ? link : max, 
      null as typeof userLinks[0] | null
    );

    return {
      profileAnalytics,
      totalLinkClicks,
      totalLinks: userLinks.length,
      linkAnalytics,
      mostClickedLink
    };
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    return null;
  }
};


export const logLinkClick = async (linkId: string, clickerIp?: string) => {
  try {
    const linkExists = await db.link.findUnique({
      where: { id: linkId },
      select: { id: true, title: true }
    });

    if (!linkExists) {
      console.warn(`Attempted to log click for non-existent link: ${linkId}`);
      return null;
    }

    const headersList = await headers();
    let ip = clickerIp || 
             headersList.get("x-forwarded-for")?.split(",")[0] ||
             headersList.get("x-real-ip") ||
             headersList.get("cf-connecting-ip") ||
             "unknown";

    // Normalize the IP
    ip = normalizeIP(ip.trim());

    const result = await db.$transaction(async (tx) => {
      const analytics = await tx.linkAnalytics.create({
        data: {
          linkId: linkId,
          clickerIp: ip,
          clickedAt: new Date(),
        },
      });

      await tx.link.update({
        where: { id: linkId },
        data: {
          clickCount: {
            increment: 1
          }
        }
      });

      return analytics;
    });

    console.log(`Logged click for link: ${linkExists.title} from IP: ${ip}`);
    return result;
  } catch (error) {
    console.error("Error logging link click:", error);

    try {
      await db.link.update({
        where: { id: linkId },
        data: {
          clickCount: {
            increment: 1
          }
        }
      });
      console.log(`Fallback: Incremented click count for link: ${linkId}`);
    } catch (fallbackError) {
      console.error("Fallback increment also failed:", fallbackError);
    }
    
    return null;
  }
};

// Enhanced link analytics
export const getLinkAnalytics = async (linkId: string) => {
  try {
    const totalClicks = await db.linkAnalytics.count({
      where: { linkId }
    });

    const uniqueClicks = await db.linkAnalytics.groupBy({
      by: ['clickerIp'],
      where: { linkId },
      _count: {
        id: true
      }
    });

    // Clicks in different time periods
    const clicksLast1Hour = await db.linkAnalytics.count({
      where: {
        linkId,
        clickedAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000)
        }
      }
    });

    const clicksLast24Hours = await db.linkAnalytics.count({
      where: {
        linkId,
        clickedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    });

    const clicksLast7Days = await db.linkAnalytics.count({
      where: {
        linkId,
        clickedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const clicksLast30Days = await db.linkAnalytics.count({
      where: {
        linkId,
        clickedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const recentClicks = await db.linkAnalytics.findMany({
      where: { linkId },
      orderBy: { clickedAt: 'desc' },
      take: 10,
      select: {
        clickedAt: true,
        clickerIp: true
      }
    });

    return {
      totalClicks,
      uniqueClicks: uniqueClicks.length,
      clicksLast1Hour,
      clicksLast24Hours,
      clicksLast7Days,
      clicksLast30Days,
      recentClicks
    };
  } catch (error) {
    console.error("Error fetching link analytics:", error);
    return null;
  }
};

// Get daily link clicks for charts
export const getDailyLinkClicks = async (linkId: string, days: number = 30) => {
  try {
    const clicks = await db.linkAnalytics.findMany({
      where: {
        linkId,
        clickedAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      },
      select: {
        clickedAt: true
      },
      orderBy: {
        clickedAt: 'desc'
      }
    });

    // Group by date
    const dailyClicks = clicks.reduce((acc, click) => {
      const date = click.clickedAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format for charts
    const chartData = Object.entries(dailyClicks)
      .map(([date, count]) => ({
        date,
        clicks: count
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return chartData;
  } catch (error) {
    console.error("Error fetching daily link clicks:", error);
    return null;
  }
};

// Get top performing links for a user
export const getTopLinks = async (userId: string, limit: number = 5) => {
  try {
    const topLinks = await db.link.findMany({
      where: { userId },
      orderBy: { clickCount: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        url: true,
        clickCount: true,
        createdAt: true
      }
    });

    return topLinks;
  } catch (error) {
    console.error("Error fetching top links:", error);
    return null;
  }
};

// Get analytics summary for dashboard
export const getAnalyticsSummary = async (userId: string) => {
  try {
    const [profileVisits, userLinks, totalLinkClicks] = await Promise.all([
      getProfileVistCount(userId),
      db.link.count({ where: { userId } }),
      db.link.aggregate({
        where: { userId },
        _sum: { clickCount: true }
      })
    ]);

    const topLink = await db.link.findFirst({
      where: { userId },
      orderBy: { clickCount: 'desc' },
      select: {
        title: true,
        clickCount: true
      }
    });

    return {
      profileVisits,
      totalLinks: userLinks,
      totalLinkClicks: totalLinkClicks._sum.clickCount || 0,
      topLink
    };
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    return null;
  }
};