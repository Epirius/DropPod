import { cn } from "@/lib/utils";
import React from "react";
import { ThemeToggle } from "./theme-provider";
import Image from "next/image";

type Props = {
  className?: string;
};

const Header = ({ className }: Props) => {
  return (
    <nav className={cn("flex h-16 border-b-2 border-border px-4", className)}>
      <div className="flex items-center gap-2">
        <Image
          src="/logo1.png"
          width={50}
          height={50}
          alt="droppod logo"
          className="h-[50px] w-[50px]"
        />
        <h1>DropPod</h1>
      </div>
      <div className="ml-auto flex items-center">
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Header;
