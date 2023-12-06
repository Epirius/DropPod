"use client";
import React, { useEffect } from "react";
import Spinner from "../ui/spinner";
import { EpisodeData, zEpisodeData } from "@/types/podcastTypes";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import PlayButton from "../player/PlayButton";

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
        <EpisodeItem episode={episode} key={episode.guid} />
      ))}
    </div>
  );
};

export default EpisodeList;

type EpisodeItemProps = {
  episode: EpisodeData;
};

const EpisodeItem = ({ episode }: EpisodeItemProps) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  useEffect(() => {
    const handlePlaying = (event: Event) => {
      const e = event as CustomEvent<EpisodeData>;
      setIsPlaying(e.detail.audio_url === episode.audio_url);
    };

    const handlePause = (event: Event) => {
      const e = event as CustomEvent<EpisodeData>;
      setIsPlaying(false);
    };

    window.addEventListener("playing", handlePlaying);
    window.addEventListener("pause", handlePause);
    return () => {
      window.removeEventListener("playing", handlePlaying);
      window.removeEventListener("pause", handlePause);
    };
  }, [setIsPlaying, episode.audio_url]);

  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent("updateEpisodeData", {
        detail: episode,
      }),
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between px-4">
        <p className="text-sm sm:truncate sm:text-xl">{episode.title}</p>
        <button
          className="pl-4 text-sm sm:pl-8 sm:text-base"
          onClick={handleClick}
        >
          <PlayButton isPlaying={isPlaying} variant="secondary" />
        </button>
      </div>
      {/* <Separator.Root className="bg-BLACK_CYNICAL  my-4 rounded-sm py-0.5" /> */}
    </div>
  );
};
