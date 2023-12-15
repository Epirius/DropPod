"use client";
import { MetaData, zMetaData } from "@/types/podcastTypes";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import PodcastDisplay from "@/components/PodcastDisplay";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

const Search = () => {
  const router = useRouter();
  const searchTerm = decodeURIComponent(useSearchParams().get("q") ?? "");
  const [searchInput, setSearchInput] = useState(searchTerm);
  const page_length = 20;

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, error } =
    useInfiniteQuery({
      queryKey: ["searching", "infinite", searchTerm],
      getNextPageParam: (
        lastPage: MetaData[],
        allPages,
        lastPageParam,
        allPageParams,
      ) => {
        if (lastPage.length < page_length) return undefined;
        return lastPageParam + 1;
      },
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }) => fetchSearchResults(searchTerm, pageParam),
      enabled: searchTerm.length > 0,
      staleTime: 60 * 1000 * 24,
    });

  const fetchSearchResults = async (
    searchTerm: string,
    page: number,
  ): Promise<MetaData[]> => {
    if (searchTerm.length === 0) return [];
    const res = await fetch(
      `/api2/podcast/search?search=${searchTerm}&page_length=${page_length}&page_number=${page}`,
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
      </div>
      {error && <p className="text-red-500">{error.message}</p>}
      {data && data.pages.flat().length === 0 && (
        <p>No results found for &quot;{searchTerm}&quot;</p>
      )}
      <PodcastDisplay data={data?.pages.flat() ?? []} variant="card" />
      {hasNextPage && !isFetching && (
        <button onClick={() => fetchNextPage()}>Load more</button>
      )}
      {isFetching && <Spinner size="sm" className="self-center" />}
    </div>
  );
};

export default Search;
