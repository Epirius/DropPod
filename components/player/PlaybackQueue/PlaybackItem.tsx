"use client";
import React from "react";
import { Button } from "../../ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { EpisodeData, zEpisodeData, zMetaData } from "@/@types/podcastTypes";
import Image from "next/image";
import {
  Cross2Icon,
  DragHandleHorizontalIcon,
  PlayIcon,
} from "@radix-ui/react-icons";
import { Skeleton } from "../../ui/skeleton";
import { PlaybackQueueItem } from "./PlaybackQueue";

const QueueItem = ({
  item,
  deleteItem,
}: {
  item: PlaybackQueueItem;
  deleteItem: (item: PlaybackQueueItem) => void;
}) => {
  const {
    data: podcastData,
    isLoading: podcastIsLoading,
    error: podcastError,
  } = useQuery({
    queryKey: ["PlaybackQueue", "podcast", item.podcastGuid],
    queryFn: async () => {
      const res = await fetch(`/api2/podcast/meta/${item.podcastGuid}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = zMetaData.parse(await res.json());
      if (!data) throw new Error("Data parsing was not ok");
      return data;
    },
    staleTime: 60 * 1000 * 24,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["PlaybackQueue", "episode", item.podcastGuid],
    queryFn: async () => {
      const res = await fetch(`/api2/podcast/episode/${item.podcastGuid}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = z.array(zEpisodeData).parse(await res.json());
      if (!data) throw new Error("Data parsing was not ok");
      return data;
    },
    staleTime: 60 * 1000 * 24,
  });
  const episode = data?.find((e) => e.audio_url === item.episodeUrl);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.episodeUrl });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const playEpisode = () => {
    deleteItem(item);
    window.dispatchEvent(
      new CustomEvent<EpisodeData>("updateEpisodeData", {
        detail: episode,
      }),
    );
  };

  if (isLoading || podcastIsLoading)
    return (
      <div style={style} {...attributes}>
        <div className="flex w-full items-center gap-2">
          <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
          <div className="flex w-full flex-col justify-between gap-1">
            <Skeleton className="h-3 w-full rounded-sm" />
            <Skeleton className="h-3 max-w-[6rem] rounded-sm" />
          </div>
          <div
            className="mr-1 flex shrink-0 gap-2"
            ref={setNodeRef}
            {...listeners}
          >
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    );

  return (
    <div style={style} {...attributes}>
      <div className="flex items-center gap-2">
        <Image
          src={episode?.image_url ?? podcastData?.image_url ?? ""}
          alt="podcast image"
          width={30}
          height={30}
          className="aspect-square h-8 w-8 shrink-0 rounded-md"
        />
        {episode?.title}
        <div className="ml-auto mr-1 flex shrink-0 gap-2">
          <Button
            ref={setNodeRef}
            {...listeners}
            variant="outline"
            size="iconSmall"
          >
            <DragHandleHorizontalIcon />
          </Button>
          <Button variant="default" size="iconSmall">
            <PlayIcon onClick={playEpisode} />
          </Button>
          <Button
            variant="secondary"
            size="iconSmall"
            onClick={() => {
              deleteItem(item);
            }}
          >
            <Cross2Icon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QueueItem;
