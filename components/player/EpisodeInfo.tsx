import React, { useEffect } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import { zEpisodeData } from "@/types/podcastTypes";
import { z } from "zod";

type EpisodeInfoProps = {
  episodeData: z.infer<typeof zEpisodeData>;
};

const EpisodeInfo = ({ episodeData }: EpisodeInfoProps) => {
  const [hidden, setHidden] = React.useState(false);
  useEffect(() => {
    setHidden(false);
  }, [episodeData.image_url]);

  return (
    <div>
      {!hidden && episodeData.image_url && episodeData.image_url.length > 0 && (
        <Image
          src={episodeData.image_url ?? ""}
          alt="Podcast cover art"
          width={100}
          height={100}
          className="h-14 w-14"
          onError={() => setHidden(true)}
        />
      )}
    </div>
  );
};

export default EpisodeInfo;
