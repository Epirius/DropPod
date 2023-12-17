import { EpisodeData } from "@/@types/podcastTypes";
import { PlaybackQueueItem } from "@/components/player/PlaybackQueue";

declare global {
  interface WindowEventMap {
    updateEpisodeData: CustomEvent<EpisodeData>;
    playing: CustomEvent<EpisodeData>;
    pause: CustomEvent<EpisodeData>;
    pushToPlaybackQueue: CustomEvent<{
      item: PlaybackQueueItem;
      position: "front" | "back";
    }>;
  }
  interface Window {
    //adds definition to Document, but you can do the same with HTMLElement
    addEventListener<K extends keyof WindowEventMap>(
      type: K,
      listener: (this: Window, ev: WindowEventMap[K]) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof WindowEventMap>(
      type: K,
      listener: (this: Window, ev: WindowEventMap[K]) => void,
      options?: boolean | EventListenerOptions,
    ): void;
    dispatchEvent<K extends keyof WindowEventMap>(ev: WindowEventMap[K]): void;
  }
}
export {};
