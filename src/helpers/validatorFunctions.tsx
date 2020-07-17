import moment from 'moment';
import axios from 'axios';
import { object, number, InferType } from 'yup';
import { ValidatorType } from 'context/validators';

export function getShardId(validator: ValidatorType, metaChainShardId: number) {
  let shardId: string;
  const isValidator = validator.peerType && !validator.peerType.includes('observer');

  if (isValidator === true) {
    shardId = validator.computedShardID.toString();
  } else {
    shardId = validator.receivedShardID.toString();
  }

  return {
    shardId: shardId === metaChainShardId.toString() ? 'Metachain' : shardId, // eslint-disable-line
    shardNumber: parseInt(shardId), // this is excluding the Metachain string, used for searching
  };
}

export function getUptimeDowntime(validator: ValidatorType) {
  const totalTime = validator.totalDownTimeSec + validator.totalUpTimeSec;
  const totalDownTimePercentege = (validator.totalDownTimeSec * 100) / totalTime;
  const totalUpTimePercentege = (validator.totalUpTimeSec * 100) / totalTime;

  const totalUpTimeLabel =
    totalUpTimePercentege.toFixed(2) +
    '% (' +
    moment.duration({ seconds: validator.totalUpTimeSec }).humanize() +
    ')'; // eslint-disable-line

  const totalDownTimeLabel =
    totalDownTimePercentege.toFixed(2) +
    '% (' +
    moment.duration({ seconds: validator.totalDownTimeSec }).humanize() +
    ')'; // eslint-disable-line

  return { totalDownTimePercentege, totalUpTimePercentege, totalUpTimeLabel, totalDownTimeLabel };
}

interface GetEpochType {
  nodeUrl: string;
  shardNumber: number;
  timeout: number;
}

const schema = object({
  status: object({
    erd_current_round: number().required(),
    erd_epoch_number: number().required(),
    erd_nonce: number().required(),
    erd_nonce_at_epoch_start: number().required(),
    erd_nonces_passed_in_current_epoch: number().required(),
    erd_round_at_epoch_start: number().required(),
    erd_rounds_passed_in_current_epoch: number().required(),
    erd_rounds_per_epoch: number().required(),
  }).required(),
}).defined();

export type NetworkStatusType = InferType<typeof schema>;

export async function getEpoch({ nodeUrl, shardNumber, timeout }: GetEpochType) {
  try {
    const {
      data: { data, code, error },
    } = await axios.get(`${nodeUrl}/network/status/${shardNumber}`, {
      timeout,
    });

    if (code === 'successful') {
      const message: NetworkStatusType = data;

      schema.validate(message, { strict: true }).catch(({ errors }) => {
        console.error('network/status response format errors: ', errors);
      });

      return {
        epoch: message.status.erd_epoch_number,
        roundAtEpochStart: message.status.erd_round_at_epoch_start,
        epochSuccess: true,
      };
    } else {
      throw new Error(error);
    }
  } catch {
    return {
      epoch: 0,
      roundAtEpochStart: 0,
      epochSuccess: false,
    };
  }
}

export interface GetRoundsType {
  elasticUrl: string;
  shardNumber: number;
  signersIndex?: number;
  timeout: number;
  roundAtEpochStart: number;
  epoch: number;
  size?: number;
}

interface RoundType {
  key: string;
  value: boolean;
}

export interface GetRoundsReturnType {
  rounds: RoundType[];
  roundsFetched: boolean;
}

export async function getRounds({
  elasticUrl,
  shardNumber,
  signersIndex,
  timeout,
  roundAtEpochStart: round,
  size = 100,
}: GetRoundsType): Promise<GetRoundsReturnType> {
  const params = {
    from: 0,
    size,
    round,
    shardId: shardNumber,
    signersIndexes: signersIndex,
  };

  try {
    const { data } = await axios.get(`${elasticUrl}/rounds`, { params, timeout });

    const rounds = data.map((round: any) => ({
      key: round.id,
      value: round.blockWasProposed,
    }));
    return {
      rounds,
      roundsFetched: rounds.length > 0,
    };
  } catch {
    if (process.env.NODE_ENV !== 'test') {
      console.error('Failed rounds');
    }
    return {
      rounds: [],
      roundsFetched: false,
    };
  }
}
