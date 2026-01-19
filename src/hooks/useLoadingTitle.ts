import { useState } from "react";
import { LOADING_TITLE, LOADING_SUBTITLE } from "@/constants/constants";

export function useLoadingTitle() {
  const getRandomTitle = () => {
    if (typeof window === "undefined") return "";
    const randomIndex = Math.floor(Math.random() * LOADING_TITLE.length);
    return LOADING_TITLE[randomIndex];
  };

  const getRandomSubtitle = () => {
    if (typeof window === "undefined") return "";
    const randomIndex = Math.floor(Math.random() * LOADING_SUBTITLE.length);
    return LOADING_SUBTITLE[randomIndex];
  };

  const [title] = useState(getRandomTitle);
  const [subtitle] = useState(getRandomSubtitle);

  return { title, subtitle };
}
