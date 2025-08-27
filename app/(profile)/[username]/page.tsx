import { logProfileVist } from '@/modules/analytics/actions';
import { getUserByUsername } from '@/modules/profile/actions';
import TreeBioProfile from '@/modules/profile/components/treebio-profile';

import { redirect } from 'next/navigation';
import React from 'react'

const Page = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;
  const profileData = await getUserByUsername(username);

  if (profileData?.username !== username) {
    return redirect("/")
  }

  logProfileVist(profileData.id).catch((err) => {
    console.error("Error logging profile visit:", err);
  });

  return (
    // @ts-ignore
    <TreeBioProfile profileData={profileData} />
  )
}

export default Page