"use client";
import React from "react";
import Spinner from "../ui/spinner";
import { zEpisodeData } from "@/types/podcastTypes";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

const EpisodeList = ({ slug }: { slug: string }) => {
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

export default EpisodeList;
