"use client";
import { AudioStore } from "@/components/player/Player";
import { Button } from "@/components/ui/button";

export default function TestPage() {
  const updateEpisodeData = AudioStore((state) => state.updateEpisodeData);
  return (
    <div className="">
      <h1>Hello</h1>
      <h2>test podcasts</h2>
      <Button
        onClick={() => {
          updateEpisodeData({
            title: "triforce episode title",
            description: "triforce episode description",
            audio_url:
              "https://pdst.fm/e/traffic.megaphone.fm/NSR2503888382.mp3?updated=1697633420",
            guid: "",
            date: "",
            image_url:
              "https://megaphone.imgix.net/podcasts/7899c86e-ca95-11eb-a133-d7b38afd7bc7/image/Triforce_PickaxeUpdated.png?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
            episode: "",
            season: "",
          });
        }}
      >
        Triforce
      </Button>
      <Button
        onClick={() => {
          updateEpisodeData({
            title: "Revolutions episode title",
            description: "Revolutions episode description",
            audio_url:
              "https://traffic.libsyn.com/secure/revolutionspodcast/Appendix_10-_The_Revolution_Devours_Its_Children_Master.mp3?dest-id=159998",
            guid: "",
            date: "",
            image_url:
              "https://static.libsyn.com/p/assets/3/4/5/f/345fbd6a253649c0/RevolutionsLogo_V2.jpg",
            episode: "",
            season: "",
          });
        }}
      >
        Revolutions
      </Button>
    </div>
  );
}
