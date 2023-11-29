import { z } from "zod";

export const zEpisodeData = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  audio_url: z.string().nullable(),
  guid: z.string().nullable(),
  date: z.string().nullable(),
  image_url: z.string().nullable(),
  episode: z.string().nullable(),
  season: z.string().nullable(),
});

export const zMetaData = z.object({
  guid: z.string(),
  url: z.string(),
  title: z.string(),
  description: z.string(),
  image_url: z.string(),
  category: z.string(),
  language_code: z.string(),
});

export type MetaData = z.infer<typeof zMetaData>;
export type EpisodeData = z.infer<typeof zEpisodeData>;
