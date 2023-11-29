import React, { useEffect } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { zEpisodeData } from "@/types/podcastTypes";
import { z } from "zod";
import { cn } from "@/lib/utils";

type EpisodeInfoProps = {
  episodeData: z.infer<typeof zEpisodeData>;
  className?: string;
};

const EpisodeInfo = ({ episodeData, className }: EpisodeInfoProps) => {
  const [hidden, setHidden] = React.useState(false);
  useEffect(() => {
    setHidden(false);
  }, [episodeData.image_url]);

  return (
    <div className={cn(" h-12 w-12 ", className)}>
      {!hidden && episodeData.image_url && episodeData.image_url.length > 0 && (
        <Image
          src={episodeData.image_url ?? ""}
          alt="Podcast cover art"
          width={100}
          height={100}
          onError={() => setHidden(true)}
          className="rounded-md"
        />
      )}
    </div>
  );
};

export default EpisodeInfo;
