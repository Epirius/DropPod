"use client";
import Spinner from "@/components/ui/spinner";
import {
  EpisodeData,
  MetaData,
  zEpisodeData,
  zMetaData,
} from "@/types/podcastTypes";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { z } from "zod";
import { Markup } from "interweave";

type PodcastPageProps = {
  params: { slug: string };
};

const PodcastPage = ({ params }: PodcastPageProps) => {
  const { slug } = params;

  return (
    <div className="flex flex-col">
      <PodcastPageHeader slug={slug} />
      <PodcastPageEpisodes slug={slug} />
    </div>
  );
};

export default PodcastPage;

const PodcastPageHeader = ({ slug }: { slug: string }) => {
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
    <div className="flex">
      <Image
        src={data.image_url}
        alt="Podcast cover art"
        width={300}
        height={300}
        className="h-80 w-80 rounded-xl"
        priority
      />
      <div>
        <h1 className="text-3xl font-bold">{data.title}</h1>
        <Markup content={data.description} />
        {/* <p
          className="hidden overflow-y-hidden md:flex"
          style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
        >
          {data.description}
        </p> */}
      </div>
    </div>
  );
};

const PodcastPageEpisodes = ({ slug }: { slug: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["podcastPage", "episode", slug],
    queryFn: async () => {
      const res = await fetch(`/api2/podcast/episode/${slug}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = z.array(zEpisodeData).parse(await res.json());
      if (!data) throw new Error("Data parsing was not ok");
      return data;
    },
  });
  if (!data) return <Spinner />;
  return (
    <div>
      {data.map((episode) => (
        <div key={episode.guid}>
          <h2>{episode.title}</h2>
          <p>{episode.description}</p>
        </div>
      ))}
    </div>
  );
};
