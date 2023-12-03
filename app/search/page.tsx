"use client";
import { MetaData, zMetaData } from "@/types/podcastTypes";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { ChangeEvent } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import Spinner from "@/components/ui/spinner";
import PodcastCard from "@/components/PodcastCard";

const Search = () => {
  const router = useRouter();
  const searchTerm = useSearchParams().get("q") ?? "";

  const debouncedFilter = useDebounce(searchTerm, 500);
  const { data, isLoading, error } = useQuery({
    queryKey: ["searching", debouncedFilter],
    queryFn: () => fetchSearchResults(debouncedFilter),
    enabled: Boolean(debouncedFilter),
    staleTime: 60 * 1000 * 24,
  });

  const fetchSearchResults = async (
    searchTerm: string,
  ): Promise<MetaData[]> => {
    if (searchTerm.length === 0) return [];
    const res = await fetch(`/api2/podcast/search?search=${searchTerm}`);
    return zMetaData.array().parse(await res.json());
  };

  const updateQueryParamas = (e: ChangeEvent<HTMLInputElement>) => {
    void router.replace(
      e.target.value.length > 0
        ? `?q=${e.target.value.replace(/ /g, "%20")}`
        : "?",
    );
  };
  return (
    <div>
      <input
        type="text"
        value={searchTerm ?? ""}
        onChange={updateQueryParamas}
        placeholder="Search"
        autoFocus
      />
      {data?.map((podcast: MetaData) => {
        return <PodcastCard data={podcast} variant="card" key={podcast.guid} />;
      })}
    </div>
  );
};

export default Search;
