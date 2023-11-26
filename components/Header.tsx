import { cn } from "@/lib/utils";
import React from "react";
import { ThemeToggle } from "./theme-provider";

type Props = {
  className?: string;
};

const Header = ({ className }: Props) => {
  return (
    <nav className={cn("bg-red-400", className)}>
      <h1>Header</h1>
      <ThemeToggle />
    </nav>
  );
};

export default Header;
