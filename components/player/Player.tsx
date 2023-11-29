"use client";

import { cn } from "@/lib/utils";
import { EpisodeData } from "@/types/podcastTypes";
import React, { useRef, useState } from "react";
import { z } from "zod";
import { create } from "zustand";
import PlayButton from "./PlayButton";
import VolumeControls from "./VolumeControls";
import Timeline from "./Timeline";
import SpeedController from "./SpeedController";
import EpisodeInfo from "./EpisodeInfo";

type Props = {
  className?: string;
};

export const AudioStore = create<{
  episodeData: EpisodeData;
  updateEpisodeData: (episodeData: EpisodeData) => any;
}>((set) => ({
  episodeData: {
    title: "",
    description: "",
    audio_url: "",
    guid: "",
    date: "",
    image_url: "",
    episode: "",
    season: "",
  },
  updateEpisodeData: (episodeData: EpisodeData) => set({ episodeData }),
}));

const Player = ({ className }: Props) => {
  const player = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const episodeData = AudioStore((state) => state.episodeData);

  return (
    <div className={cn("h-28 w-full border-t-2 border-border", className)}>
      <audio
        hidden={true}
        src={episodeData.audio_url ?? undefined}
        ref={player}
        title={episodeData.title ?? undefined}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
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
