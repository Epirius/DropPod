import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const zodFetch = <zType>(
  url: string,
  schema: z.Schema<zType>,
  init?: RequestInit,
): Promise<zType> => {
  return fetch(url, init)
    .then((res) => res.json())
    .then((data) => schema.parse(data));
};
