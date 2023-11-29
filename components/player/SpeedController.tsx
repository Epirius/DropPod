"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { TriangleUpIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface SpeedControllerProps {
  playerRef: React.RefObject<HTMLAudioElement>;
  className?: string;
}

const SpeedController = ({ playerRef, className }: SpeedControllerProps) => {
  const [speed, setSpeed] = useState<number>(1);

  useEffect(() => {
    const player = playerRef.current;
    player?.addEventListener("ratechange", refreshAudioData);
    return () => {
      player?.removeEventListener("ratechange", refreshAudioData);
    };
  }, [playerRef]);

  const refreshAudioData = (e: Event) => {
    const target = e.target as HTMLAudioElement;
    setSpeed(target.playbackRate);
  };

  const setPlaybackSpeed = (speed: number) => {
    if (!playerRef.current) return;
    speed = Math.max(0.1, Math.min(speed, 16.0));
    playerRef.current.playbackRate = speed;
  };

  const changeSpeed = (delta: number) => {
    const newSpeed = Number((speed + delta).toFixed(1));
    setPlaybackSpeed(newSpeed);
  };

  const toggleSpeed = () => {
    const options = [1, 1.2, 1.5, 1.7, 2];
    if (!options.includes(speed)) {
      setPlaybackSpeed(1);
    }
    const index = options.indexOf(speed);
    const newSpeed = options.at(index + 1) ?? 1;
    setPlaybackSpeed(newSpeed);
  };

  const handleWheel = (e: React.WheelEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.1 : -0.1;
    changeSpeed(delta);
  };

  return (
    <div
      className={cn(
        "group flex h-8 w-24 items-center justify-center sm:hover:justify-between",
        className,
      )}
    >
      <div className="ml-1 hidden sm:block">
        <Button
          className="translate-x-8 transition duration-300 ease-in-out group-hover:transform-none"
          variant="outline"
          size="tiny"
          onClick={() => changeSpeed(-0.1)}
          aria-label="Decrease speed"
        >
          <TriangleDownIcon />
        </Button>
      </div>

      <Button
        onClick={toggleSpeed}
        variant="secondary"
        size="lable"
        onWheel={handleWheel}
        className="z-10"
        aria-label="Playback speed. click to toggle"
      >
        {speed}x
      </Button>

      <div className="mr-1 hidden sm:block">
        <Button
          className="-translate-x-8 transition duration-300 ease-in-out group-hover:transform-none"
          variant="outline"
          size="tiny"
          onClick={() => changeSpeed(0.1)}
          aria-label="Increase speed"
        >
          <TriangleUpIcon />
        </Button>
      </div>
    </div>
  );
};

export default SpeedController;
