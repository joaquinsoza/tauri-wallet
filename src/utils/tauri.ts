import { open } from "@tauri-apps/api/shell";

export const openExternalLink = async (url: string) => {
  await open(url).catch(console.error);
};
