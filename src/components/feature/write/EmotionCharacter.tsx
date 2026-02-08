"use client";

import Image from "next/image";
import { Activity } from "react";
import { EMOTION_SCORES } from "@/constants/constants";

interface EmotionCharacterProps {
  score: number;
}

export function EmotionCharacter({ score }: EmotionCharacterProps) {
  return (
    <div className="flex justify-center mt-10 mb-4">
      {EMOTION_SCORES.map((emotionData, index) => (
        <Activity key={index} mode={score - 1 === index ? "visible" : "hidden"}>
          <Image
            src={emotionData.img}
            alt={`emotion-${index + 1}`}
            width={80}
            height={80}
            loading="eager"
          />
        </Activity>
      ))}
    </div>
  );
}
