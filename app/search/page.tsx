"use client";
import { MetaData, zMetaData } from "@/types/podcastTypes";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { ChangeEvent } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import PodcastDisplay from "@/components/PodcastDisplay";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

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
    <div className="flex flex-col gap-4">
      <div className="flex">
        <input
          type="search"
          value={searchTerm ?? ""}
          onChange={updateQueryParamas}
          placeholder="Search"
          autoFocus
          className="w-1/2 rounded-3xl rounded-r-none border-2 border-r-0 px-4 sm:w-80"
        />
        <Button
          variant="secondary"
          className=" rounded-3xl rounded-l-none border-2 border-l-0"
        >
          <MagnifyingGlassIcon />
        </Button>
      </div>
      <PodcastDisplay data={data} variant="card" />
    </div>
  );
};

export default Search;
