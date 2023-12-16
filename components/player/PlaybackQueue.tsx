import React, { useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Button } from "../ui/button";
import { LayersIcon } from "@radix-ui/react-icons";

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
    <Button onClick={() => console.log(queue)}>
      <LayersIcon />
    </Button>
  );
};

export default PlaybackQueue;
