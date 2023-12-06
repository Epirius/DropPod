import React from "react";
import { MetaData } from "@/types/podcastTypes";
import { VariantProps, cva } from "class-variance-authority";
import Image from "next/image";
import { Badge } from "./ui/badge";
import Link from "next/link";
import clsx from "clsx";

type variant = "card" | "list";

export interface PodcastCardProps {
  data: MetaData;
  variant?: variant;
}

const PodcastCard = ({ data, variant = "card" }: PodcastCardProps) => {
  return (
    <Link legacyBehavior href={`/podcast/${data.guid}`}>
      <div
        className={clsx(
          "group mb-6 text-ellipsis break-normal hover:cursor-pointer",
          variant === "card" && "w-80",
        )}
      >
        <a className={clsx(variant === "list" && "flex")}>
          <div
            className={clsx(
              "relative mb-1 overflow-hidden rounded-xl",
              variant === "list" && "h-28 w-28",
              variant === "card" && "h-80 w-80",
            )}
          >
            <Image
              src={data.image_url}
              alt={`conver art for: ${data.title}`}
              fill={true}
              className=" transition duration-100 ease-in-out group-hover:scale-105"
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
