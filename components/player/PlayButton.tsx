"use client";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

type PlayButtonProps = {
  isPlaying: boolean;
  playerRef: React.RefObject<HTMLAudioElement>;
};

const PlayButton = ({ isPlaying, playerRef }: PlayButtonProps) => {
  const handlePlayButtonClick = () => {
    if (!isPlaying) {
      playerRef.current?.play();
    } else {
      playerRef.current?.pause();
    }
  };

  return (
    <Button
      size="roundedIcon"
      onClick={handlePlayButtonClick}
      aria-label={isPlaying ? "Pause button" : "Play button"}
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </Button>
  );
};

export default PlayButton;
