import React, { useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Button } from "../ui/button";
import { LayersIcon } from "@radix-ui/react-icons";
import { TooltipWrapper } from "../ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const PlaybackQueue = () => {
  const [queue, setQueue] = useLocalStorage("playbackQueue", [] as string[]);

  useEffect(() => {
    const pushToQueue = ({
      detail: { episode, position },
    }: WindowEventMap["pushToPlaybackQueue"]) => {
      if (!episode.guid) {
        console.error("Episode guid is required to add to queue");
        return;
      }
      if (queue.includes(episode.guid)) {
        return;
      }
      if (position === "front") {
        setQueue([episode.guid, ...queue]);
      } else {
        setQueue([...queue, episode.guid]);
      }
    };
    window.addEventListener("pushToPlaybackQueue", pushToQueue);
    return () => {
      window.removeEventListener("pushToPlaybackQueue", pushToQueue);
    };
  }, [queue, setQueue]);

  return (
    <Dialog>
      <TooltipWrapper text="playback queue">
        <DialogTrigger asChild>
          <Button variant="secondary" className="rounded-full">
            <LayersIcon />
          </Button>
        </DialogTrigger>
      </TooltipWrapper>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Playing next</DialogTitle>
        </DialogHeader>
        <div className="relative flex max-h-[80vh] flex-col gap-2 overflow-y-scroll">
          {queue.map((guid) => (
            <div key={guid}>{guid}</div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaybackQueue;
