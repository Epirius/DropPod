"use client";

import { cn } from "@/lib/utils";
import { EpisodeData } from "@/types/podcastTypes";
import React, { useEffect, useRef, useState } from "react";
import PlayButton from "./PlayButton";
import VolumeControls from "./VolumeControls";
import Timeline from "./Timeline";
import SpeedController from "./SpeedController";
import EpisodeInfo from "./EpisodeInfo";

type Props = {
  className?: string;
};

type playState = "playing" | "pause";

const Player = ({ className }: Props) => {
  const player = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [episodeData, setEpisodeData] = useState<EpisodeData>({
    title: "",
    description: "",
    audio_url: "",
    guid: "",
    date: "",
    image_url: "",
    episode: "",
    season: "",
  });

  const handlePlayPauseChange = (change: playState) => {
    setIsPlaying(change === "playing");
    window.dispatchEvent(
      new CustomEvent(change, {
        detail: episodeData,
      }),
    );
  };

  useEffect(() => {
    if (!player.current) return;
    void player.current.play();
  }, [episodeData]);

  useEffect(() => {
    const handleEpisodeData = async (event: Event) => {
      const data = (event as CustomEvent<EpisodeData>).detail;
      if (data.audio_url === episodeData.audio_url) {
        if (player.current?.paused) {
          await player.current?.play();
          return;
        } else {
          void player.current?.pause();
          return;
        }
      }
      if (!player.current) return;
      player.current.pause();
      setEpisodeData(data);
    };
    window.addEventListener("updateEpisodeData", handleEpisodeData);
    return () => {
      window.removeEventListener("updateEpisodeData", handleEpisodeData);
    };
  }, [episodeData.audio_url, player, setEpisodeData]);

  return (
    <div className={cn("h-28 w-full border-t-2 border-border", className)}>
      <audio
        hidden={true}
        src={episodeData.audio_url ?? undefined}
        ref={player}
        title={episodeData.title ?? undefined}
        onPlaying={() => handlePlayPauseChange("playing")}
        onPause={() => handlePlayPauseChange("pause")}
        onLoadStart={() => handlePlayPauseChange("pause")}
      />
      <div className="grid h-full w-full grid-cols-5 grid-rows-2 items-center justify-items-center">
        <SpeedController playerRef={player} className="col-start-2" />
        <PlayButton
          isPlaying={isPlaying}
          playerRef={player}
          className="col-start-3"
        />
        <VolumeControls playerRef={player} className="" />
        <EpisodeInfo
          episodeData={episodeData}
          className="col-start-4 sm:col-start-5 sm:row-span-2 sm:mr-4 sm:h-20 sm:w-20 sm:justify-self-end"
        />
        <Timeline
          playerRef={player}
          className="col-start-2 col-end-5 row-start-2"
        />
      </div>
    </div>
  );
};

export default Player;
