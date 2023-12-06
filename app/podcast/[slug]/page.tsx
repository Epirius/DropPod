import React from "react";
import PodcastHeader from "@/components/podcastComponents/PodcastHeader";
import EpisodeList from "@/components/podcastComponents/EpisodeList";

type PodcastPageProps = {
  params: { slug: string };
};

const PodcastPage = ({ params }: PodcastPageProps) => {
  const { slug } = params;

  return (
    <div className="flex flex-col gap-8">
      <PodcastHeader slug={slug} />
      <EpisodeList slug={slug} />
    </div>
  );
};

export default PodcastPage;
