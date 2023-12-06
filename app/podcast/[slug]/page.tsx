import React from "react";
import PodcastHeader from "@/components/podcastComponents/PodcastHeader";
import EpisodeList from "@/components/podcastComponents/EpisodeList";
import Favourite from "@/components/Favourite";

type PodcastPageProps = {
  params: { slug: string };
};

const PodcastPage = ({ params }: PodcastPageProps) => {
  const { slug } = params;

  return (
    <div className="flex flex-col gap-8">
      <PodcastHeader slug={slug} />
      <Favourite podcastGuid={slug} className="self-center" />
      <EpisodeList slug={slug} />
    </div>
  );
};

export default PodcastPage;
