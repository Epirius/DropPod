"use client";

import { cn } from "@/lib/utils";
import { zEpisodeData } from "@/types/podcastTypes";
import React, { useRef } from "react";
import { z } from "zod";
import { create } from "zustand";
import { Button } from "../ui/button";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";

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

  const handlePlayButtonClick = () => {
    if (!isPlaying) {
      if (episodeData.audio_url === "" || episodeData.audio_url === undefined)
        return;
      play();
    } else {
      pause();
    }
  };

  const play = () => {
    void player.current?.play();
  };

  const pause = () => {
    void player.current?.pause();
  };

  const playerSeek = (time: number) => {
    if (player.current) player.current.currentTime = time;
  };

  return (
    <nav className={cn("h-20 border-t-2 border-border", className)}>
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
      <div className="flex h-full w-full items-center justify-center">
        <PlayButton isPlaying={isPlaying} handleClick={handlePlayButtonClick} />
      </div>
    </nav>
  );
};

export default Player;

type PlayButtonProps = {
  isPlaying: boolean;
  handleClick: () => void;
};

const PlayButton = ({ isPlaying, handleClick }: PlayButtonProps) => {
  return (
    <Button size="roundedIcon" onClick={handleClick}>
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </Button>
  );
};
