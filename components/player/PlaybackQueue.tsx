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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zEpisodeData, zMetaData } from "@/@types/podcastTypes";
import Image from "next/image";
import { Cross2Icon, DragHandleHorizontalIcon } from "@radix-ui/react-icons";

export type PlaybackQueueItem = {
  podcastGuid: string;
  episodeGuid: string;
};

const PlaybackQueue = () => {
  const [queue, setQueue] = useLocalStorage(
    "playbackQueue",
    [] as PlaybackQueueItem[],
  );

  useEffect(() => {
    const pushToQueue = ({
      detail: { item, position },
    }: WindowEventMap["pushToPlaybackQueue"]) => {
      const { podcastGuid, episodeGuid } = item;
      const filteredQueue = queue.filter(
        (item) => item.episodeGuid !== episodeGuid,
      );
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

  const deleteItem = (item: PlaybackQueueItem) => {
    const newQueue = queue.filter((i) => i.episodeGuid !== item.episodeGuid);
    setQueue(newQueue);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = queue.findIndex((i) => i.episodeGuid === active.id);
      const newIndex = queue.findIndex((i) => i.episodeGuid === over?.id);
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
              items={queue.map((item) => item.episodeGuid)}
              strategy={verticalListSortingStrategy}
            >
              {queue.map((item) => (
                <QueueItem
                  key={item.episodeGuid}
                  item={item}
                  deleteItem={deleteItem}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </DialogContent>
    </Dialog>
  );
};

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
  const episode = data?.find((e) => e.guid === item.episodeGuid);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.episodeGuid });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div style={style} {...attributes}>
      <div className="flex items-center gap-1">
        <Image
          src={episode?.image_url ?? podcastData?.image_url ?? ""}
          alt="podcast image"
          width={30}
          height={30}
          className="aspect-square h-8 w-8 shrink-0 rounded-md"
        />
        {episode?.title}
        <div className="ml-auto mr-1 flex shrink-0 gap-2">
          <Button ref={setNodeRef} {...listeners} variant="outline" size="icon">
            <DragHandleHorizontalIcon />
          </Button>
          <Button
            variant="secondary"
            size="icon"
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

export default PlaybackQueue;
