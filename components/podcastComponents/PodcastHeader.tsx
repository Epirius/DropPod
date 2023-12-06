"use client";
import { zMetaData } from "@/types/podcastTypes";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Spinner from "../ui/spinner";
import { Markup } from "interweave";
import Image from "next/image";

const PodcastHeader = ({ slug }: { slug: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["podcastPage", "meta", slug],
    queryFn: async () => {
      const res = await fetch(`/api2/podcast/meta/${slug}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = zMetaData.parse(await res.json());
      if (!data) throw new Error("Data parsing was not ok");
      return data;
    },
  });
  if (!data) return <Spinner />;
  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <Image
        src={data.image_url}
        alt="Podcast cover art"
        width={300}
        height={300}
        className="h-40 w-40 self-center rounded-xl sm:h-80 sm:w-80 md:self-start"
        priority
      />
      <div className="flex flex-col gap-4">
        <h1 className="self-center text-center text-3xl font-bold md:self-start md:text-left">
          {data.title}
        </h1>
        <Markup
          content={data.description}
          className="self-center text-center md:self-start md:text-left"
        />
      </div>
    </div>
  );
};

export default PodcastHeader;
