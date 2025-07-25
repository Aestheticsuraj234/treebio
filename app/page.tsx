import { Button } from "@/components/ui/button";
import { onBoardUser } from "@/modules/auth/actions";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

export default  async function Home() {

  const user = await onBoardUser();

  if (!user.success) {
    return redirect("/sign-in");
  }

  return (
    <div>
      <Button>Click Me</Button>
      <UserButton />
    </div>
  );
}
