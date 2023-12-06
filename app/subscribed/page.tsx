"use client";
import PodcastCard from "@/components/PodcastCard";
import { zMetaData } from "@/types/podcastTypes";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { z } from "zod";

const FavouritePage = () => {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "unauthenticated") {
      void router.push("/login");
    }
  }, [router, session]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["favourite", session.data?.user?.id],
    staleTime: 60 * 1000 * 5,
    queryFn: () =>
      fetch(`/api2/subscribe`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((res) => z.array(zMetaData).parse(res)),
  });
  return (
    <div>
      <h1>My Podcast</h1>
      {data &&
        data.map((podcast) => {
          return <PodcastCard key={podcast.guid} data={podcast} />;
        })}
    </div>
  );
};

export default FavouritePage;
