"use client";

import { cn } from "@/lib/utils";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";
import { SignInOut } from "./header/Profile";
import { Button } from "./ui/button";

type LoginModalWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

const LoginModalWrapper = ({ children, className }: LoginModalWrapperProps) => {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className={cn("h-fit w-fit cursor-pointer", className)}>
            <div className={"pointer-events-none"}>{children}</div>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>This requires authentication</DialogHeader>
          <div className="flex gap-2">
            <SignInOut />
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    );
  } else {
    return <>{children}</>;
  }
};

export default LoginModalWrapper;
