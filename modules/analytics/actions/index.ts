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