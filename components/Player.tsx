import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
};

const Player = ({ className }: Props) => {
  return <nav className={cn("bg-red-400", className)}>Player</nav>;
};

export default Player;
