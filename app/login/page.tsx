"use client";
import { SignInOut } from "@/components/header/Profile";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const LoginPage = () => {
  const session = useSession();
  const router = useRouter();
  if (session.status === "authenticated") {
    router.push("/");
  }
  return (
    <div className="flex w-full flex-col items-center justify-center gap-12 ">
      <h1 className="text-3xl font-bold">Login page:</h1>
      <div className="flex gap-4">
        <SignInOut />
        <Button onClick={() => router.push("/")} variant="ghost">
          Home
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
