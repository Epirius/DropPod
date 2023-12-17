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

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = queue.findIndex((guid) => guid === active.id);
      const newIndex = queue.findIndex((guid) => guid === over?.id);
      const newQueue = [...queue];
      newQueue.splice(oldIndex, 1);
      newQueue.splice(newIndex, 0, active.id.toString());
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
              items={queue}
              strategy={verticalListSortingStrategy}
            >
              {queue.map((guid) => (
                <QueueItem key={guid} guid={guid} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const QueueItem = ({ guid }: { guid: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: guid });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {guid}
    </div>
  );
};

export default PlaybackQueue;
