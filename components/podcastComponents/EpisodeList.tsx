"use client";
import React from "react";
import Spinner from "../ui/spinner";
import { EpisodeData, zEpisodeData } from "@/types/podcastTypes";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { AudioStore } from "../player/Player";

const EpisodeList = ({ slug }: { slug: string }) => {
  const updateEpisodeData = AudioStore((state) => state.updateEpisodeData);
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
        <EpisodeItem
          episode={episode}
          key={episode.guid}
          updateEpisodeData={updateEpisodeData}
        />
      ))}
    </div>
  );
};

export default EpisodeList;

type EpisodeItemProps = {
  episode: EpisodeData;
  updateEpisodeData: (episode: EpisodeData) => void;
};

const EpisodeItem = ({ episode, updateEpisodeData }: EpisodeItemProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between px-4">
        <p className="text-sm sm:truncate sm:text-xl">{episode.title}</p>
        <button
          className="pl-4 text-sm sm:pl-8 sm:text-base"
          onClick={() => updateEpisodeData(episode)}
        >
          play
        </button>
      </div>
      {/* <Separator.Root className="bg-BLACK_CYNICAL  my-4 rounded-sm py-0.5" /> */}
    </div>
  );
};
