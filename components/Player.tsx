"use client";

import { cn } from "@/lib/utils";
import { zEpisodeData } from "@/types/podcastTypes";
import React from "react";
import { z } from "zod";
import { create } from "zustand";

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
  const episodeData = AudioStore((state) => state.episodeData);

  React.useEffect(() => {
    console.log(episodeData);
  }, [episodeData]);

  return (
    <nav className={cn("h-20 border-t-2 border-border", className)}>
      <h1>Player</h1>
      <audio controls src={episodeData.audio_url ?? undefined} />
    </nav>
  );
};

export default Player;
