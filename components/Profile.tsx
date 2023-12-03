"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

type Props = {
  imageSrc?: string;
  fallbackText?: string;
};

export const Profile = ({ imageSrc, fallbackText }: Props) => {
  const { data: session, status } = useSession();
  return (
    <div>
      {session ? (
        <Avatar onClick={() => signOut()}>
          <AvatarImage src={session.user?.image ?? ""} alt="Profile image" />
          <AvatarFallback>
            {session.user?.name?.slice(0, 2) ?? "Hi"}
          </AvatarFallback>
        </Avatar>
      ) : (
        <Button onClick={() => signIn()}>Sign In</Button>
      )}
    </div>
  );
};

export default Profile;
