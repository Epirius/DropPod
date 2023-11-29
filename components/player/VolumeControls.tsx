"use client";
import React, { useEffect, useState } from "react";
import { Slider } from "../ui/slider";
import {
  SpeakerOffIcon,
  SpeakerQuietIcon,
  SpeakerLoudIcon,
} from "@radix-ui/react-icons";

interface VolumeProps {
  playerRef: React.RefObject<HTMLAudioElement>;
}

const VolumeControls = ({ playerRef }: VolumeProps) => {
  const [volume, setVolume] = useState<number>(1.0);
  const [muted, setMuted] = useState<boolean>(false);

  useEffect(() => {
    const player = playerRef.current;
    player?.addEventListener("volumechange", refreshAudioData);
    return () => {
      player?.removeEventListener("volumechange", refreshAudioData);
    };
  }, [playerRef]);

  const refreshAudioData = (e: Event) => {
    const target = e.target as HTMLAudioElement;
    setVolume(target.volume);
    setMuted(target.muted);
  };

  const setPlayerVolume = (volume: number) => {
    if (!playerRef.current) return;
    playerRef.current.volume = volume;
    if (volume < 0.02) {
      playerRef.current.muted = true;
    } else {
      playerRef.current.muted = false;
    }
  };

  return (
    <div className="hidden items-center gap-1 sm:flex">
      {muted ? <SpeakerOffIcon /> : <SpeakerQuietIcon />}
      <Slider
        onValueChange={(e: number[]) => {
          if (e[0]) setPlayerVolume(e[0]);
        }}
        value={[volume]}
        defaultValue={[0]}
        step={0.01}
        max={1}
        className="h-5 w-20"
        aria-label="Volume Slider"
      />
      <SpeakerLoudIcon className="ml-1" />
    </div>
  );
};

export default VolumeControls;
