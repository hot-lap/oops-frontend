import { useEffect, useState } from "react";
import {
  FIRST_VISIT_TITLE,
  FIRST_VISIT_SUBTITLE,
  RETURN_VISIT_TITLE,
  RETURN_VISIT_SUBTITLE,
} from "@/constants/constants";

export function useHomeTitle() {
  const getInitialTitle = () => {
    if (typeof window === "undefined") return "";

    const hasVisited = localStorage.getItem("hasVisitedHome");
    if (!hasVisited) {
      return FIRST_VISIT_TITLE;
    } else {
      const randomIndex = Math.floor(Math.random() * RETURN_VISIT_TITLE.length);
      return RETURN_VISIT_TITLE[randomIndex];
    }
  };

  const getInitialSubtitle = () => {
    if (typeof window === "undefined") return "";

    const hasVisited = localStorage.getItem("hasVisitedHome");
    return hasVisited ? RETURN_VISIT_SUBTITLE : FIRST_VISIT_SUBTITLE;
  };

  const [title] = useState(getInitialTitle);
  const [subtitle] = useState(getInitialSubtitle);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedHome");
    if (!hasVisited) {
      localStorage.setItem("hasVisitedHome", "true");
    }
  }, []);

  return { title, subtitle };
}
