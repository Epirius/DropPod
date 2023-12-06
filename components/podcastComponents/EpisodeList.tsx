"use client";
import React, { useEffect } from "react";
import Spinner from "../ui/spinner";
import { EpisodeData, zEpisodeData } from "@/types/podcastTypes";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import PlayButton from "../player/PlayButton";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

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
      <Separator />
      {data.map((episode) => (
        <>
          <EpisodeItem data={episode} key={episode.guid} />
          <Separator />
        </>
      ))}
    </div>
  );
};

export default EpisodeList;

type EpisodeItemProps = {
  data: EpisodeData;
};

const EpisodeItem = ({ data }: EpisodeItemProps) => {
  const { episode, title, date, audio_url, guid, season, description } = data;
  const [isPlaying, setIsPlaying] = React.useState(false);

  useEffect(() => {
    const handlePlaying = (event: Event) => {
      const e = event as CustomEvent<EpisodeData>;
      setIsPlaying(e.detail.audio_url === data.audio_url);
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
  }, [setIsPlaying, data.audio_url]);

  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent("updateEpisodeData", {
        detail: data,
      }),
    );
  };

  return (
    <div className="flex flex-row items-center gap-2 py-4">
      {(episode || season) && (
        <Badge
          variant="info"
          className="hidden flex-shrink-0 font-bold sm:block"
        >
          <p>
            <span>{season ? `S${season} ` : ""}</span>
            <span>{episode ? `E${episode}` : ""}</span>
          </p>
        </Badge>
      )}
      <p className="text-sm  sm:text-base md:text-lg">{title}</p>
      <div className="ml-auto flex items-center gap-8">
        {date && (
          <p className="hidden md:block">
            {new Date(date).toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </p>
        )}

        <PlayButton
          isPlaying={isPlaying}
          handlePlayButtonClick={handleClick}
          variant="outline"
        />
      </div>
    </div>
  );
};
