"use client";
import PodcastDisplay from "@/components/PodcastDisplay";
import Spinner from "@/components/ui/spinner";
import Category from "@/lib/categories";
import { MetaData, zMetaData } from "@/@types/podcastTypes";
import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { zodFetch } from "@/lib/utils";
import { z } from "zod";

type CategoryPageProps = {
  params: { slug: string };
};

const CategoryPage = ({ params }: CategoryPageProps) => {
  const { slug } = params;
  const page_length = 20;

  const { data, isLoading, isFetching, fetchNextPage, hasNextPage, error } =
    useInfiniteQuery({
      queryKey: ["category", "infinite", slug],
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
      queryFn: ({ pageParam = 1 }) => fetchCategoryResults(slug, pageParam),
      staleTime: 60 * 1000 * 24,
    });

  const fetchCategoryResults = async (
    slug: string,
    page: number,
  ): Promise<MetaData[]> => {
    const languageCode = "en";
    return zodFetch(
      `/api2/podcast/list?category=${slug}&lang=${languageCode}&page_length=${page_length}&page_number=${page}`,
      z.array(zMetaData),
    );
  };

  if (!(Object.values(Category) as string[]).includes(slug)) {
    return (
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold">Category not found</h1>
        <Link
          href="/category"
          className="text-lg text-blue-500 hover:underline"
        >
          See list of categories
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between sm:flex-row">
        <h1 className="text-4xl font-bold capitalize">{slug}</h1>
        <Link
          href="/category"
          className="flex items-center hover:underline sm:flex-row"
        >
          back
        </Link>
      </div>
      {data && <PodcastDisplay data={data.pages.flat() ?? []} />}
      {hasNextPage && !isFetching && (
        <button onClick={() => fetchNextPage()}>Load more</button>
      )}
      {isFetching && <Spinner size="sm" className="self-center" />}
    </div>
  );
};

export default CategoryPage;
