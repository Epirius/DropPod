"use client";
import React from "react";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import {
  DialogContent,
  Dialog,
  DialogTrigger,
  DialogTitle,
} from "../ui/dialog";
import { useSession } from "next-auth/react";
import { SignInOut, UserAvatar } from "./Profile";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { ThemeToggle } from "../theme-provider";

type HamburgerProps = {
  navLinks?: {
    name: string;
    link: string;
  }[];
};

const Hamburger = ({ navLinks }: HamburgerProps) => {
  const { data: session, status } = useSession();
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <HamburgerMenuIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <div className="flex items-center gap-4">
            {status === "authenticated" && <UserAvatar />}
            <h2>Menu</h2>
          </div>
        </DialogTitle>
        <div>
          <Separator className="-mt-1 mb-4" />
          <ul className="flex flex-col gap-2 pl-2">
            {navLinks &&
              navLinks.map((navLink) => (
                <li key={navLink.name} className="hover:underline">
                  <Link href={navLink.link} onClick={() => setOpen(false)}>
                    {navLink.name}
                  </Link>
                </li>
              ))}
          </ul>

          <Separator className="my-4" />
          <div className="flex ">
            <SignInOut />
            <ThemeToggle className="ml-auto" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Hamburger;
