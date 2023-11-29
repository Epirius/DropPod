"use client";

import { cn } from "@/lib/utils";
import { zEpisodeData } from "@/types/podcastTypes";
import React, { useRef, useState } from "react";
import { z } from "zod";
import { create } from "zustand";
import PlayButton from "./PlayButton";
import VolumeControls from "./VolumeControls";
import Timeline from "./Timeline";

type Props = {
  className?: string;
};

export const AudioStore = create<{
  episodeData: z.infer<typeof zEpisodeData>;
  updateEpisodeData: (episodeData: z.infer<typeof zEpisodeData>) => any;
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
  updateEpisodeData: (episodeData: z.infer<typeof zEpisodeData>) =>
    set({ episodeData }),
}));

const Player = ({ className }: Props) => {
  const player = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const episodeData = AudioStore((state) => state.episodeData);

  return (
    <div className={cn("h-20 border-t-2 border-border", className)}>
      <audio
        hidden={true}
        src={episodeData.audio_url ?? undefined}
        ref={player}
        title={episodeData.title ?? undefined}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        // onTimeUpdate={(e) => refreshAudioData(e)}
        // onVolumeChange={(e) => refreshAudioData(e)}
        // onRateChange={(e) => refreshAudioData(e)}
      />
      <div className="flex h-full w-full items-center justify-center gap-10">
        <PlayButton isPlaying={isPlaying} playerRef={player} />
        <VolumeControls playerRef={player} />
        <Timeline playerRef={player} />
      </div>
    </div>
  );
};

export default Player;
