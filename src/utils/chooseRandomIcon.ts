import AlturaPenguin from "@/assets/AlturaPenguin.gif";
import AlturaPenguin4 from "@/assets/AlturaPenguin4.gif";
import AlturaPenguin9 from "@/assets/AlturaPenguin9.gif";
import AlturaPenguin14 from "@/assets/AlturaPenguin14.gif";
import AlturaPenguin16 from "@/assets/AlturaPenguin16.gif";
import OlympusSindicate from "@/assets/OlympusSindicate.png";
import UmbraSpunk from "@/assets/UmbraSpunk.png";
import { StaticImageData } from "next/image";

export function chooseRandomIcon(): string {
  const icons = [
    AlturaPenguin,
    AlturaPenguin4,
    AlturaPenguin9,
    AlturaPenguin14,
    AlturaPenguin16,
    OlympusSindicate,
    UmbraSpunk,
  ];

  const randomIndex = Math.floor(Math.random() * icons.length);

  return icons[randomIndex].src;
}
