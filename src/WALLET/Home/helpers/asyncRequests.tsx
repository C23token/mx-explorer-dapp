import axios from 'axios';

type DetailsType = {
  nodeUrl: string;
  publicKey: string;
  timeout: number;
};

export async function getWalletDetails({ nodeUrl, publicKey, timeout }: DetailsType) {
  try {
    const {
      data: {
        account: { balance, nonce },
      },
    } = await axios.get(`${nodeUrl}/address/${publicKey}`, { timeout });

    return {
      balance,
      nonce,
      detailsFetched: true,
    };
  } catch (err) {
    console.error(err);
    return {
      balance: '',
      nonce: '',
      detailsFetched: true,
    };
  }
}
export async function getTokens({ nodeUrl, publicKey, timeout }: DetailsType) {
  try {
    const data = await axios.post(
      `${nodeUrl}/transaction/send-user-funds`,
      {
        receiver: publicKey,
      },
      { timeout }
    );

    return Boolean(data);
  } catch (err) {
    console.error(err);
    return false;
  }
}

type GetLatestTransactionsType = {
  elasticUrl: string;
  publicKey: string;
  timeout: number;
};

export async function getLatestTransactions({
  elasticUrl,
  publicKey,
  timeout,
}: GetLatestTransactionsType) {
  try {
    const {
      data: {
        hits: { hits },
      },
    } = await axios.post(
      `${elasticUrl}/transactions/_search`,
      {
        query: {
          bool: {
            should: [{ match: { sender: publicKey } }, { match: { receiver: publicKey } }],
          },
        },
        sort: {
          timestamp: {
            order: 'desc',
          },
        },
        size: 15,
      },
      { timeout }
    );

    console.warn(11, hits);

    return {
      transactions: hits.map((transaction: any) => transaction._source),
      success: true,
    };
  } catch (err) {
    return {
      transactions: [],
      success: false,
    };
  }
}
