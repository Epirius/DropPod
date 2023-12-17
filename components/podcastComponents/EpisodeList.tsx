"use client";
import React, { useEffect } from "react";
import Spinner from "../ui/spinner";
import { EpisodeData, zEpisodeData } from "@/@types/podcastTypes";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import PlayButton from "../player/PlayButton";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { CardStackPlusIcon } from "@radix-ui/react-icons";
import { TooltipWrapper } from "../ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { PinTopIcon, PinBottomIcon } from "@radix-ui/react-icons";
import { DialogClose } from "@radix-ui/react-dialog";

const EpisodeList = ({ slug }: { slug: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["podcastPage", "episode", slug],
    queryFn: async () => {
      const res = await fetch(`/api2/podcast/episode/${slug}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = z.array(zEpisodeData).parse(await res.json());
      if (!data) throw new Error("Data parsing was not ok");
      return data;
    },
  });
  if (!data) return <Spinner />;
  return (
    <div>
      <Separator />
      {data.map((episode) => (
        <div key={episode.guid}>
          <EpisodeItem data={episode} podcastSlug={slug} />
          <Separator />
        </div>
      ))}
    </div>
  );
};

export default EpisodeList;

type EpisodeItemProps = {
  data: EpisodeData;
  podcastSlug: string;
};

const EpisodeItem = ({ data, podcastSlug }: EpisodeItemProps) => {
  const { episode, title, date, audio_url, guid, season, description } = data;
  const [isPlaying, setIsPlaying] = React.useState(false);

  useEffect(() => {
    const handlePlaying = ({ detail }: CustomEvent<EpisodeData>) => {
      setIsPlaying(detail.audio_url === data.audio_url);
    };

    const handlePause = (_event: CustomEvent<EpisodeData>) => {
      setIsPlaying(false);
    };

    window.addEventListener("playing", handlePlaying);
    window.addEventListener("pause", handlePause);
    return () => {
      window.removeEventListener("playing", handlePlaying);
      window.removeEventListener("pause", handlePause);
    };
  }, [setIsPlaying, data.audio_url]);

  const handleClick = () => {
    window.dispatchEvent(
      new CustomEvent<EpisodeData>("updateEpisodeData", {
        detail: data,
      }),
    );
  };

  const addToPlaybackQueue = (position: "front" | "back") => {
    if (!guid) {
      console.error("guid is undefined for: ", title);
      return;
    }
    const event: WindowEventMap["pushToPlaybackQueue"] = new CustomEvent(
      "pushToPlaybackQueue",
      {
        detail: {
          item: { podcastGuid: podcastSlug, episodeGuid: guid },
          position,
        },
      },
    );
    window.dispatchEvent(event);
  };

  return (
    <div className="flex flex-row items-center gap-2 py-4">
      {(episode || season) && (
        <Badge
          variant="info"
          className="hidden flex-shrink-0 font-bold sm:block"
        >
          <p>
            <span>{season ? `S${season} ` : ""}</span>
            <span>{episode ? `E${episode}` : ""}</span>
          </p>
        </Badge>
      )}
      <p className="text-sm  sm:text-base md:text-lg">{title}</p>
      <div className="ml-auto flex items-center gap-6">
        <Dialog>
          <TooltipWrapper text="Add to queue">
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <CardStackPlusIcon />
              </Button>
            </DialogTrigger>
          </TooltipWrapper>
          <DialogContent>
            <div className="flex flex-col gap-4 px-8 py-4">
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  className="flex gap-2"
                  onClick={() => addToPlaybackQueue("front")}
                >
                  <PinTopIcon />
                  <p>Add to next</p>
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  className="flex gap-2"
                  onClick={() => addToPlaybackQueue("back")}
                >
                  <PinBottomIcon />
                  <p>Add to last</p>
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
        {date && (
          <p className="hidden w-16 md:block">
            {new Date(date).toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </p>
        )}

        <PlayButton
          isPlaying={isPlaying}
          handlePlayButtonClick={handleClick}
          variant="outline"
        />
      </div>
    </div>
  );
};
