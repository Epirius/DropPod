import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
};

const Player = ({ className }: Props) => {
  return (
    <nav className={cn("border-t-2 border-border h-20", className)}>Player</nav>
  );
};

export default Player;
