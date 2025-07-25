"use client";

import { UserButton } from "@clerk/nextjs";


interface Props {
  showName?: boolean;
}
export default function UserControl({ showName }: Props) {
 

  return (
    <UserButton
      
      showName={showName}
    />
  );
}