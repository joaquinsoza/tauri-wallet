import { PublicWalletInfo } from "@/interfaces/wallet";
import { open } from "@tauri-apps/api/shell";
import { invoke } from "@tauri-apps/api/tauri";

export const openExternalLink = async (url: string) => {
  await open(url).catch(console.error);
};

export const loginIntoWallet = async (
  password: string,
  uuid: string
): Promise<PublicWalletInfo | null> => {
  if (!password) return null;
  const response: PublicWalletInfo = await invoke("login", {
    uuid: uuid,
    password: password,
  });
  return response;
};
