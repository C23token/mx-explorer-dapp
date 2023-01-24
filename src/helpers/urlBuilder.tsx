export const urlBuilder = {
  shard: (shard: number | string) => `/blocks?shard=${shard}`,
  receiverShard: (shard: number | string) =>
    `/transactions?receiverShard=${shard}`,
  senderShard: (shard: number | string) => `/transactions?senderShard=${shard}`,
  transactionDetails: (hash: number | string) => `/transactions/${hash}`,
  transactionDetailsScResults: (hash: string) =>
    `/transactions/${hash}/sc-results`,
  transactionDetailsLogs: (hash: string) => `/transactions/${hash}/logs`,
  nodeDetails: (publicKey: string) => `/nodes/${publicKey}`,
  accountDetails: (address: string) => `/accounts/${address}`,
  accountDetailsContractCode: (address: string) => `/accounts/${address}/code`,
  accountDetailsTokens: (address: string) => `/accounts/${address}/tokens`,
  accountDetailsNfts: (address: string) => `/accounts/${address}/nfts`,
  accountDetailsStaking: (address: string) => `/accounts/${address}/staking`,
  accountDetailsAnalytics: (address: string) =>
    `/accounts/${address}/analytics`,
  accountDetailsScResults: (address: string) =>
    `/accounts/${address}/sc-results`,
  accountDetailsContracts: (address: string) =>
    `/accounts/${address}/contracts`,
  identityDetails: (id: string) => `/identities/${id}`,
  tokenDetails: (tokenId: string) => `/tokens/${tokenId}`,
  tokenDetailsAccounts: (tokenId: string) => `/tokens/${tokenId}/accounts`,
  tokenDetailsLockedAccounts: (tokenId: string) =>
    `/tokens/${tokenId}/locked-accounts`,
  tokenDetailsRoles: (tokenId: string) => `/tokens/${tokenId}/roles`,
  collectionDetails: (identifier: string) => `/collections/${identifier}`,
  collectionDetailsRoles: (identifier: string) =>
    `/collections/${identifier}/roles`,
  nftDetails: (identifier: string) => `/nfts/${identifier}`,
  providerDetails: (address: string) => `/providers/${address}`,
  providerDetailsTransactions: (address: string) =>
    `/providers/${address}/transactions`,
  miniblockDetails: (hash: string) => `/miniblocks/${hash}`
};
