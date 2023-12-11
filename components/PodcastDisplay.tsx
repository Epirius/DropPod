"use client";
import { MetaData } from "@/types/podcastTypes";
import React from "react";
import PodcastCard, { variant } from "./PodcastCard";
import { cn } from "@/lib/utils";
import clsx from "clsx";

type PodcastDisplayProps = {
  data?: MetaData[];
  variant?: variant;
  className?: string;
};

const PodcastDisplay = ({
  data,
  variant = "card",
  className,
}: PodcastDisplayProps) => {
  return (
    <div
      className={cn(
        clsx(" flex w-full flex-wrap overflow-x-auto", [
          variant === "list" && "flex-col",
        ]),
        className,
      )}
    >
      {data?.map((podcast: MetaData) => {
        return (
          <PodcastCard
            data={podcast}
            variant={variant}
            key={podcast.guid}
            className={clsx([
              variant === "card" && "w-1/2 p-2 sm:w-1/3 md:w-1/4 lg:w-1/5",
            ])}
          />
        );
      })}
    </div>
  );
};

export default PodcastDisplay;
