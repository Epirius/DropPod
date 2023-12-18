"use client";

import { cn } from "@/lib/utils";
import { EpisodeData } from "@/@types/podcastTypes";
import React, { useEffect, useRef, useState } from "react";
import PlayButton from "./PlayButton";
import VolumeControls from "./VolumeControls";
import Timeline from "./Timeline";
import SpeedController from "./SpeedController";
import EpisodeImage from "./EpisodeImage";
import PlaybackQueue from "./PlaybackQueue/PlaybackQueue";

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
    const handleEpisodeData = async ({ detail }: CustomEvent<EpisodeData>) => {
      if (detail.audio_url === episodeData.audio_url) {
        handlePlayButtonClick();
        return;
      }
      player.current?.pause();
      setEpisodeData(detail);
    };
    window.addEventListener("updateEpisodeData", handleEpisodeData);
    return () => {
      window.removeEventListener("updateEpisodeData", handleEpisodeData);
    };
  }, [episodeData.audio_url, player, setEpisodeData]);

  const handlePlayButtonClick = async () => {
    if (!player.current) return;
    player.current.paused
      ? await player.current.play()
      : void player.current.pause();
  };

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
        autoPlay
      />
      <div className="grid-rows-[2fr 1fr] grid h-full w-full grid-cols-5 items-center justify-items-center">
        <PlaybackQueue
          playerRef={player}
          className="col-start-1 self-end sm:row-span-2 sm:self-center"
        />
        <SpeedController
          playerRef={player}
          className="col-start-2 self-end pb-2"
        />
        <PlayButton
          isPlaying={isPlaying}
          handlePlayButtonClick={handlePlayButtonClick}
          className="col-start-3 self-end"
        />
        <VolumeControls
          playerRef={player}
          className="hidden self-end pb-[0.7rem] sm:flex"
        />
        <EpisodeImage
          episodeData={episodeData}
          className="col-start-4 self-end sm:col-start-5 sm:row-span-2 sm:mr-4 sm:h-20 sm:w-20 sm:self-center sm:justify-self-end"
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
