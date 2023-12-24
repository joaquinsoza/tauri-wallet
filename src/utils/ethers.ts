import { Provider, formatEther } from "ethers";

export const getWalletBalance = async (provider: Provider, address: string) => {
  const balance = await provider.getBalance(address);
  return formatEther(balance);
};
