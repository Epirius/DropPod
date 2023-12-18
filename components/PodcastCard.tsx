import React from "react";
import { MetaData } from "@/@types/podcastTypes";
import Image from "next/image";
import { Badge } from "./ui/badge";
import Link from "next/link";
import clsx from "clsx";
import { cn } from "@/lib/utils";

export type variant = "card" | "list";

export interface PodcastCardProps {
  data: MetaData;
  variant?: variant;
  className?: string;
}

const PodcastCard = ({
  data,
  variant = "card",
  className,
}: PodcastCardProps) => {
  return (
    <Link legacyBehavior href={`/podcast/${data.guid}`} className="relative">
      <div
        className={cn(
          clsx(
            "group mb-6 text-ellipsis break-normal hover:cursor-pointer",
            variant === "card" && "w-80",
          ),
          className,
        )}
      >
        <a className={clsx(variant === "list" && "flex")}>
          <div
            className={clsx(
              "relative mb-1 overflow-hidden rounded-xl",
              variant === "list" && "aspect-square w-28",
              variant === "card" && "aspect-square w-full",
            )}
          >
            <Image
              src={data.image_url}
              alt={`conver art for: ${data.title}`}
              fill={true}
              sizes="15rem"
              className=" aspect-square transition duration-100 ease-in-out group-hover:scale-105"
              priority={true}
            />
          </div>
          <div className={clsx(variant === "list" && "pl-4")}>
            <h2 className="text-lg font-bold">{data.title}</h2>
            <Badge variant="outline">{data.category}</Badge>
          </div>
        </a>
      </div>
    </Link>
  );
};

export default PodcastCard;
