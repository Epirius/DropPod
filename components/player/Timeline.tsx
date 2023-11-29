"use client";

import React, { useEffect, useState } from "react";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils";

type TimelineProps = {
  playerRef: React.RefObject<HTMLAudioElement>;
  className?: string;
};

const Timeline = ({ playerRef, className }: TimelineProps) => {
  const [currentPlayerTime, setCurrentPlayerTime] = useState<number[]>([0]);
  const [durationTime, setDurationTime] = useState<number>(NaN);

  useEffect(() => {
    const player = playerRef.current;
    player?.addEventListener("timeupdate", refreshAudioData);
    return () => {
      player?.removeEventListener("timeupdate", refreshAudioData);
    };
  }, [playerRef]);

  const refreshAudioData = (e: Event) => {
    const target = e.target as HTMLAudioElement;
    setCurrentPlayerTime([target.currentTime]);
    setDurationTime(target.duration);
  };

  const playerSeek = (time: number[]) => {
    if (playerRef.current) playerRef.current.currentTime = time[0];
  };

  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      {!isNaN(durationTime) && (
        <span aria-label="Current playback time">
          {secondsToTime(currentPlayerTime[0])}
        </span>
      )}
      <Slider
        className="h-5 w-60 sm:w-80"
        value={currentPlayerTime}
        defaultValue={[0]}
        step={1.0}
        onValueChange={playerSeek}
        max={isNaN(durationTime) ? 0 : durationTime}
        aria-label="Playback timeline slider"
      />
      {!isNaN(durationTime) && (
        <span aria-label="Duration">{secondsToTime(durationTime)}</span>
      )}
    </div>
  );
};

export default Timeline;

function secondsToTime(seconds: number): string {
  const milliseconds = seconds * 1000;
  const date = new Date(milliseconds);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const remainingSeconds = date.getUTCSeconds();

  const formattedHours = hours > 0 ? hours + ":" : "";
  const formattedMinutes =
    minutes > 0 ? (minutes < 10 ? "0" + minutes : minutes) + ":" : "0:";
  const formattedSeconds =
    remainingSeconds < 10
      ? "0" + remainingSeconds
      : remainingSeconds.toString();
  return formattedHours + formattedMinutes + formattedSeconds;
}
