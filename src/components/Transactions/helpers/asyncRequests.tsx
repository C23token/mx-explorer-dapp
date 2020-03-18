import axios from 'axios';

interface ParamsType {
  elasticUrl: string;
  size?: number;
  addressId?: string;
  shardType: 'senderShard' | 'receiverShard' | undefined;
  shardId: number | undefined;
  timeout: number;
}

const setAddressQuery = (addressId: string | undefined) =>
  addressId
    ? {
        query: {
          bool: {
            should: [{ match: { sender: addressId } }, { match: { receiver: addressId } }],
          },
        },
      }
    : {};

const shardQuery = (
  shardId: number | undefined,
  size = 1,
  shardType: 'senderShard' | 'receiverShard' | undefined
) =>
  shardId && shardType
    ? {
        query: { bool: { must: [{ match: { [shardType]: shardId } }] } },
        sort: { timestamp: { order: 'desc' } },
        from: (size - 1) * 25,
        size: 25,
      }
    : {};

const shardQueryCount = (
  shardId: number | undefined,
  size = 1,
  shardType: 'senderShard' | 'receiverShard' | undefined
) =>
  shardId && shardType
    ? {
        query: { bool: { must: [{ match: { [shardType]: shardId } }] } },
      }
    : {};

export async function getTransactions({
  elasticUrl,
  addressId = '',
  size = 1,
  shardId,
  shardType,
  timeout,
}: ParamsType) {
  let data = [];
  try {
    const {
      data: { hits },
    } = await axios.post(
      `${elasticUrl}/transactions/_search`,
      {
        sort: { timestamp: { order: 'desc' } },
        from: (size - 1) * 50,
        size: 50,
        ...{
          query: { match_all: {} },
          ...setAddressQuery(addressId),
          ...shardQuery(shardId, size, shardType),
        },
      },
      { timeout }
    );

    data = hits.hits.map((entry: any) => entry._source);

    return {
      data,
      success: data.length > 0,
    };
  } catch {
    return {
      data,
      success: false,
    };
  }
}

export async function getTotalTransactions({
  elasticUrl,
  addressId = '',
  size = 1,
  shardId,
  shardType,
  timeout,
}: ParamsType) {
  try {
    const {
      data: { count },
    } = await axios.post(
      `${elasticUrl}/transactions/_count`,
      {
        ...{
          query: { match_all: {} },
          ...setAddressQuery(addressId),
          ...shardQueryCount(shardId, size, shardType),
        },
      },
      {
        timeout,
      }
    );

    return {
      count,
      success: true,
    };
  } catch {
    return {
      count: 0,
      success: false,
    };
  }
}

interface DetailsType {
  nodeUrl: string;
  addressId: string;
  timeout: number;
}

export async function getAddressDetails({ nodeUrl, addressId, timeout }: DetailsType) {
  try {
    const {
      data: {
        account: { balance, code },
      },
    } = await axios.get(`${nodeUrl}/address/${addressId}`, { timeout });

    return {
      addressId,
      balance,
      code,
      detailsFetched: true,
    };
  } catch (err) {
    return {
      addressId: '',
      balance: '',
      code: '',
      detailsFetched: false,
    };
  }
}
