"use client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";

export const Profile = () => {
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    return <SignInOut />;
  }
  return (
    <div onClick={() => signOut()}>
      <UserAvatar />
    </div>
  );
};

const SignInOut = () => {
  const { data: session, status } = useSession();
  if (status === "authenticated") {
    return (
      <Button variant="ghost" onClick={() => signOut()}>
        Sign Out
      </Button>
    );
  }
  return (
    <Button variant="ghost" onClick={() => signIn()}>
      Sign In
    </Button>
  );
};

const UserAvatar = () => {
  const { data: session, status } = useSession();
  return (
    <Avatar>
      <AvatarImage src={session?.user?.image ?? ""} alt="Profile image" />
      <AvatarFallback>
        {session?.user?.name?.slice(0, 2) ?? "Hi"}
      </AvatarFallback>
    </Avatar>
  );
};

export default Profile;
export { SignInOut, UserAvatar };
