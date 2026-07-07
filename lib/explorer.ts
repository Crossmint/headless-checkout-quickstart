const EXPLORER_BASE_URLS: Record<string, string> = {
  ethereum: "https://etherscan.io",
  "ethereum-sepolia": "https://sepolia.etherscan.io",
  polygon: "https://polygonscan.com",
  "polygon-amoy": "https://amoy.polygonscan.com",
  base: "https://basescan.org",
  "base-sepolia": "https://sepolia.basescan.org",
  arbitrum: "https://arbiscan.io",
  "arbitrum-sepolia": "https://sepolia.arbiscan.io",
  optimism: "https://optimistic.etherscan.io",
  "optimism-sepolia": "https://sepolia-optimism.etherscan.io",
};

export const getTransactionUrl = (chain?: string, txId?: string) => {
  if (!chain || !txId) return null;
  const baseUrl = EXPLORER_BASE_URLS[chain];
  return baseUrl ? `${baseUrl}/tx/${txId}` : null;
};

export const getNftUrl = (
  chain?: string,
  contractAddress?: string,
  tokenId?: string
) => {
  if (!chain || !contractAddress || !tokenId) return null;
  const baseUrl = EXPLORER_BASE_URLS[chain];
  return baseUrl ? `${baseUrl}/nft/${contractAddress}/${tokenId}` : null;
};
