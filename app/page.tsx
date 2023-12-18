"use client";
import { useState, useEffect } from "react";
import { MetaData, zMetaData } from "@/@types/podcastTypes";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const q = useQuery({
    queryKey: ["category", "history"],
    queryFn: () => fetchCategoryResults("history"),
    staleTime: 60 * 1000 * 24,
  });

  const fetchCategoryResults = async (slug: string): Promise<MetaData[]> => {
    const languageCode = "en";
    const page_length = 12;
    const res = await fetch(
      `/api2/podcast/list?category=${slug}&lang=${languageCode}&page_length=${page_length}`,
    );
    return zMetaData.array().parse(await res.json());
  };

  return (
    <div className="">
      <h1>Hello</h1>
      {q.data?.map((podcast: MetaData) => {
        return <p key={podcast.guid}>{podcast.title}</p>;
      })}
    </div>
  );
}
