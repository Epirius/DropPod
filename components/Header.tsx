import { cn } from "@/lib/utils"
import React from "react";

type Props = {
  className?: string;
};

const Header = ({ className }: Props) => {
  return <nav className={cn("bg-red-400", className)}>Header</nav>;
};

export default Header;
