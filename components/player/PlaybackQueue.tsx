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
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
      if (
        queue.some(
          (item) =>
            item.episodeGuid === episodeGuid &&
            item.podcastGuid === podcastGuid,
        )
      ) {
        return;
      }
      if (position === "front") {
        setQueue([item, ...queue]);
      } else {
        setQueue([...queue, item]);
      }
    };
    window.addEventListener("pushToPlaybackQueue", pushToQueue);
    return () => {
      window.removeEventListener("pushToPlaybackQueue", pushToQueue);
    };
  }, [queue, setQueue]);

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
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext
              items={queue.map((item) => item.episodeGuid)}
              strategy={verticalListSortingStrategy}
            >
              {queue.map((item) => (
                <QueueItem key={item.episodeGuid} item={item} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const QueueItem = ({ item }: { item: PlaybackQueueItem }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.episodeGuid });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {item.episodeGuid}
    </div>
  );
};

export default PlaybackQueue;
