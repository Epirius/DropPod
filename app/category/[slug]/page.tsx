"use client";
import PodcastDisplay from "@/components/PodcastDisplay";
import Category from "@/lib/categories";
import { MetaData, zMetaData } from "@/types/podcastTypes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

type CategoryPageProps = {
  params: { slug: string };
};

const CategoryPage = ({ params }: CategoryPageProps) => {
  const { slug } = params;

  const { data, isLoading, error } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => fetchCategoryResults(slug),
    staleTime: 60 * 1000 * 24,
  });

  const fetchCategoryResults = async (slug: string): Promise<MetaData[]> => {
    const languageCode = "en";
    const quantity = 12;
    const res = await fetch(
      `/api2/podcast/list?category=${slug}&lang=${languageCode}&quantity=${quantity}`,
    );
    return zMetaData.array().parse(await res.json());
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
      {data && <PodcastDisplay data={data} />}
    </div>
  );
};

export default CategoryPage;
