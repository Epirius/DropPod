"use client";
import React, { use, useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Button } from "../../ui/button";
import { LayersIcon } from "@radix-ui/react-icons";
import { TooltipWrapper } from "../../ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { EpisodeData, zEpisodeData } from "@/@types/podcastTypes";
import QueueItem from "./PlaybackItem";

export type PlaybackQueueItem = {
  podcastGuid: string;
  episodeUrl: string;
};

type PlaybackQueueProps = {
  playerRef: React.RefObject<HTMLAudioElement>;
  className?: string;
};

const PlaybackQueue = ({ playerRef, className }: PlaybackQueueProps) => {
  const [queue, setQueue] = useLocalStorage(
    "playbackQueue",
    [] as PlaybackQueueItem[],
  );

  useEffect(() => {
    const pushToQueue = ({
      detail: { item, position },
    }: WindowEventMap["pushToPlaybackQueue"]) => {
      const { podcastGuid, episodeUrl } = item;
      const filteredQueue = queue.filter((i) => i.episodeUrl !== episodeUrl);
      if (position === "front") {
        setQueue([item, ...filteredQueue]);
      } else {
        setQueue([...filteredQueue, item]);
      }
    };
    window.addEventListener("pushToPlaybackQueue", pushToQueue);
    return () => {
      window.removeEventListener("pushToPlaybackQueue", pushToQueue);
    };
  }, [queue, setQueue]);

  const deleteItem = (episodeUrl: string) => {
    const newQueue = queue.filter((i) => i.episodeUrl !== episodeUrl);
    setQueue(newQueue);
  };

  const firstEpisode = useQuery({
    queryKey: ["PlaybackQueue", "episode", queue[0]?.podcastGuid],
    queryFn: async () => {
      const res = await fetch(`/api2/podcast/episode/${queue[0]?.podcastGuid}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = z.array(zEpisodeData).parse(await res.json());
      if (!data) throw new Error("Data parsing was not ok");
      return data;
    },
    staleTime: 60 * 1000 * 24,
  });

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const handleFinishedEpisode = () => {
      const nextEpisode = queue[0];
      if (!nextEpisode) return;
      new Promise<EpisodeData>((resolve, reject) => {
        const intervalId = setInterval(() => {
          if (!firstEpisode.isLoading) {
            clearInterval(intervalId);
            if (!firstEpisode.data || firstEpisode.error) reject("no data");
            const episode = firstEpisode.data?.find(
              (e) => e.audio_url === nextEpisode.episodeUrl,
            );
            if (!episode) {
              reject("no episode");
            } else {
              resolve(episode);
            }
          }
        }, 100);

        const timeoutId = setTimeout(() => {
          clearTimeout(timeoutId);
          reject("timeout");
        }, 3000);
      })
        .then((episode: EpisodeData) => {
          window.dispatchEvent(
            new CustomEvent<EpisodeData>("updateEpisodeData", {
              detail: episode,
            }),
          );
          setQueue(queue.slice(1));
        })
        .catch((err) => {
          console.error("Playing next episode failed: ", err);
        });
    };

    player.addEventListener("ended", handleFinishedEpisode);
    return () => {
      player.removeEventListener("ended", handleFinishedEpisode);
    };
  }, [queue, playerRef, setQueue, firstEpisode]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const removePlayingEpisode = () => {
      const episodeUrl = player.currentSrc;
      deleteItem(episodeUrl);
    };

    player.addEventListener("loadedmetadata", removePlayingEpisode);
    return () => {
      player.removeEventListener("loadedmetadata", removePlayingEpisode);
    };
  }, [deleteItem, playerRef]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = queue.findIndex((i) => i.episodeUrl === active.id);
      const newIndex = queue.findIndex((i) => i.episodeUrl === over?.id);
      const newQueue = [...queue];
      const item = newQueue.splice(oldIndex, 1);
      if (item.length < 1) {
        console.error("item not found in queue");
        return;
      }
      newQueue.splice(newIndex, 0, item[0]);
      setQueue(newQueue);
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 5,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <div className={className}>
      <Dialog>
        <TooltipWrapper text="playback queue">
          <DialogTrigger asChild>
            <Button variant="secondary" className="rounded-full">
              <LayersIcon />
            </Button>
          </DialogTrigger>
        </TooltipWrapper>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Playing next</DialogTitle>
          </DialogHeader>
          {queue.length < 1 && <p>Queue is empty</p>}
          <div className="relative flex max-h-[80vh] flex-col gap-2 overflow-y-auto">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
              sensors={sensors}
              autoScroll={{ threshold: { x: 0, y: 0.2 } }}
            >
              <SortableContext
                items={queue.map((item) => item.episodeUrl)}
                strategy={verticalListSortingStrategy}
              >
                {queue.map((item) => (
                  <QueueItem
                    key={item.episodeUrl}
                    item={item}
                    deleteItem={deleteItem}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaybackQueue;
