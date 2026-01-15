// 타이틀 랜덤 노출 hook
import { useEffect, useState } from "react";
import {
  FIRST_VISIT_TITLE,
  FIRST_VISIT_SUBTITLE,
  RETURN_VISIT_TITLE,
  RETURN_VISIT_SUBTITLE,
  LOADING_TITLE,
  LOADING_SUBTITLE,
} from "@/constants/constants";

type Mode = "home" | "loading";

export function useRandomTitle(mode: Mode) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    if (mode === "home") {
      const hasVisited = localStorage.getItem("hasVisitedHome");

      if (!hasVisited) {
        localStorage.setItem("hasVisitedHome", "true");
        setTitle(FIRST_VISIT_TITLE);
        setSubtitle(FIRST_VISIT_SUBTITLE);
      } else {
        const randomIndex = Math.floor(
          Math.random() * RETURN_VISIT_TITLE.length
        );
        setTitle(RETURN_VISIT_TITLE[randomIndex]);
        setSubtitle(RETURN_VISIT_SUBTITLE);
      }
    }

    if (mode === "loading") {
      const randomTitle = Math.floor(Math.random() * LOADING_TITLE.length);
      const randomSubtitle = Math.floor(
        Math.random() * LOADING_SUBTITLE.length
      );

      setTitle(LOADING_TITLE[randomTitle]);
      setSubtitle(LOADING_SUBTITLE[randomSubtitle]);
    }
  }, [mode]);

  return { title, subtitle };
}
