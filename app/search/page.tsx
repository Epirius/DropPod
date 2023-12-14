"use client";
import { MetaData, zMetaData } from "@/types/podcastTypes";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import PodcastDisplay from "@/components/PodcastDisplay";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

const Search = () => {
  const router = useRouter();
  const searchTerm = decodeURIComponent(useSearchParams().get("q") ?? "");
  const [searchInput, setSearchInput] = useState(searchTerm);

  const { data, isLoading, error } = useQuery({
    queryKey: ["searching"],
    queryFn: () => fetchSearchResults(searchTerm),
    enabled: searchTerm.length > 0,
    staleTime: 60 * 1000 * 24,
  });

  const fetchSearchResults = async (
    searchTerm: string,
  ): Promise<MetaData[]> => {
    if (searchTerm.length === 0) return [];
    const quantity = 20;
    const res = await fetch(
      `/api2/podcast/search?search=${searchTerm}&quantity=${quantity}`,
    );
    return zMetaData.array().parse(await res.json());
  };

  const debouncedSearchInput = useDebounce(
    encodeURIComponent(searchInput),
    300,
  );

  useEffect(() => {
    void router.replace(
      debouncedSearchInput.length > 0
        ? `?q=${debouncedSearchInput.replace(/ /g, "%20")}`
        : "?",
    );
  }, [debouncedSearchInput, router]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-8">
        <div className="flex">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
        {isLoading && <Spinner size="sm" />}
      </div>
      {error && <p className="text-red-500">{error.message}</p>}
      {data && data.length === 0 && (
        <p>No results found for &quot;{searchTerm}&quot;</p>
      )}
      <PodcastDisplay data={data} variant="card" />
    </div>
  );
};

export default Search;
