"use client";
import { useSession } from "next-auth/react";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zMetaData } from "@/@types/podcastTypes";
import Spinner from "./ui/spinner";
import { Button } from "./ui/button";
import { cn, zodFetch } from "@/lib/utils";
import { TooltipWrapper } from "./ui/tooltip";
import { z } from "zod";

interface Props {
  podcastGuid?: string;
  className?: string;
}

const Favourite = ({ podcastGuid, className }: Props) => {
  const session = useSession();
  const queryClient = useQueryClient();

  const favouriteList = useQuery({
    queryKey: ["favourite", session.data?.user?.id],
    staleTime: 60 * 1000 * 5,
    retry: session.status === "authenticated" ? 3 : false,
    queryFn: async () => {
      if (session.status !== "authenticated") {
        return Promise.reject(new Error("not authenticated"));
      }
      return zodFetch(`/api2/subscribe`, z.array(zMetaData), {
        credentials: "include",
      }).catch((err) => {
        console.error(err);
        throw err;
      });
    },
  });

  const mutateFavourite = useMutation({
    mutationFn: (isFav?: boolean) => {
      if (session.status !== "authenticated") {
        return Promise.reject("not authenticated");
      }
      if (!podcastGuid || isFav === undefined) {
        console.log("podcastGuid is undefined");
        return Promise.reject(`Illegal mutation: 
        ${!podcastGuid ? "podcastGuid is undefined" : ""}
        ${isFav === undefined ? `isFav is undefined}` : ""}
        `);
      }
      if (isFav) {
        return fetch(`/api2/subscribe?podcast_id=${podcastGuid}`, {
          method: "DELETE",
          credentials: "include",
        });
      } else {
        return fetch(`/api2/subscribe?podcast_id=${podcastGuid}`, {
          method: "POST",
          credentials: "include",
        });
      }
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["favourite", session.data?.user?.id],
      }),
  });

  if (!podcastGuid) {
    return <div>The slug is invalid. slug: {podcastGuid}</div>;
  }

  const isFav = favouriteList.data
    ?.map((podcast) => podcast.guid)
    .includes(podcastGuid);

  return (
    <TooltipWrapper
      text={
        isFav ? "Remove podcast from favourites" : "Add podcast to favourites"
      }
    >
      <Button
        className={cn(
          "group flex h-12 w-12 items-center justify-center rounded-full text-2xl font-semibold",
          className,
        )}
        variant="secondary"
        disabled={favouriteList.status !== "success"}
        onClick={() => mutateFavourite.mutate(isFav)}
        aria-label={
          isFav ? "remove podcast from favourites" : "add podcast to favourites"
        }
      >
        {favouriteList.isPending && <Spinner size="xs" thickness="sm" />}
        {favouriteList.isError && (
          <HeartIcon className=" group-hover:text-green-300" />
        )}
        {favouriteList.isSuccess &&
          (isFav ? (
            <HeartFilledIcon className="group-hover:text-red-300" />
          ) : (
            <HeartIcon className=" group-hover:text-green-300" />
          ))}
      </Button>
    </TooltipWrapper>
  );
};

export default Favourite;
