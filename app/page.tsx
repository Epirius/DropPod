import { zFrontPageData } from "@/@types/podcastTypes";
import PodcastDisplay from "@/components/PodcastDisplay";

export default async function Home() {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/podcast/frontpage`,
    { next: { revalidate: 3600 } },
  )
    .then((res) => res.json())
    .then((res) => zFrontPageData.parse(res));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">Editors Choice</h2>
        <PodcastDisplay data={data.editors_choice} />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold">Popular</h2>
        <PodcastDisplay data={data.popular} />
      </div>
    </div>
  );
}
