"use client";
import { PauseIcon, PlayIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "../ui/button";
import { VariantProps } from "class-variance-authority";

interface PlayButtonProps extends VariantProps<typeof buttonVariants> {
  isPlaying: boolean;
  handlePlayButtonClick?: () => void;
  className?: string;
}

const PlayButton = ({
  isPlaying,
  handlePlayButtonClick,
  className,
  variant,
}: PlayButtonProps) => {
  return (
    <Button
      size="roundedIcon"
      onClick={handlePlayButtonClick}
      aria-label={isPlaying ? "Pause button" : "Play button"}
      className={className}
      variant={variant}
    >
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </Button>
  );
};

export default PlayButton;
