export interface PublicWalletInfo {
  uuid: string;
  name: string;
  address?: string;
}

export interface WalletCreationResponse {
  mnemonic: string;
  uuid: string;
}
