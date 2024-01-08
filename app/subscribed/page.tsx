"use client";
import PodcastDisplay from "@/components/PodcastDisplay";
import { zMetaData } from "@/@types/podcastTypes";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { z } from "zod";
import { zodFetch } from "@/lib/utils";

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
      zodFetch(`/api2/subscribe`, z.array(zMetaData), {
        credentials: "include",
      }),
  });
  return (
    <div>
      <h1>My Podcast</h1>
      {data && <PodcastDisplay data={data} />}
    </div>
  );
};

export default FavouritePage;
