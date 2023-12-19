import { cn } from "@/lib/utils";
import React from "react";
import { ThemeToggle } from "../theme-provider";
import Image from "next/image";
import Link from "next/link";
import Profile from "./Profile";
import Hamburger from "./Hamburger";

type Props = {
  className?: string;
};

const Header = ({ className }: Props) => {
  const navLinks = [
    {
      name: "My Podcasts",
      link: "/subscribed",
    },
    {
      name: "Categories",
      link: "/category",
    },
    {
      name: "Search",
      link: "/search",
    },
  ];

  return (
    <header
      className={cn("flex h-16 border-b-2 border-border px-4", className)}
    >
      <Link href="/" className="flex items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/logo1.png"
            width={50}
            height={50}
            alt="droppod logo"
            className="h-[50px] w-[50px]"
            unoptimized={true}
          />
          <h1 className="hidden sm:block">DropPod</h1>
        </div>
      </Link>
      <div className="ml-auto hidden items-center gap-4 md:flex">
        <nav>
          <ul className="flex items-center gap-4">
            {navLinks.map((navLink) => (
              <li key={navLink.name} className="hover:underline">
                <Link href={navLink.link}>{navLink.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
        <Profile />
      </div>
      <div className=" ml-auto flex items-center md:hidden">
        <Hamburger navLinks={navLinks} />
      </div>
    </header>
  );
};

export default Header;
