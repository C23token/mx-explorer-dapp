import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo } from 'react';
import { useGlobalState } from '../../context';
import { Loader } from './../../sharedComponents';
import { getValidatorsData, getValidatorStatistics } from './helpers/asyncRequests';
import { populateValidatorsTable } from './helpers/validatorHelpers';
import ShardsList from './ShardsList';
import ValidatorsTable, { StateType } from './ValidatorsTable';
import ValidatorsBrandTable from './ValidatorsBrandTable';
import { useLocation } from 'react-router-dom';

export interface ValidatorType {
  computedShardID: number;
  publicKey: string;
  isActive: boolean;
  isValidator: boolean;
  peerType: 'waiting' | 'eligible' | 'observer';
  maxInactiveTime: string;
  nodeDisplayName: string;
  receivedShardID: number;
  timeStamp: string;
  totalDownTimeSec: number;
  totalUpTimeSec: number;
  versionNumber: string;
  shardId: string;
  shardNumber: number;
  star: boolean;
  rating: number;
}

export const initialState: StateType = {
  shardData: [
    {
      shardID: '',
      status: '',
      allValidators: 0,
      allActiveValidators: 0,
      shardNumber: -1,
    },
  ],
  shardsList: [''],
  validators: [],
  validatorsAndObservers: [],
};

export interface ShardDataType {
  [key: string]: {
    allValidators: number;
    allActiveValidators: number;
    shardNumber: number;
  };
}

const Validators = () => {
  const ref = React.useRef(null);
  const {
    activeTestnet: { nodeUrl, validatorDetails, validatorStatistics },
    timeout,
    config: { metaChainShardId },
  } = useGlobalState();

  const [state, setState] = React.useState({ success: true, data: initialState });

  const getData = () => {
    Promise.all([
      getValidatorsData({
        nodeUrl,
        timeout: Math.max(timeout, 10000),
      }),
      getValidatorStatistics({ nodeUrl, timeout: Math.max(timeout, 10000) }),
    ]).then(([getValidatorsDataResponse, validatorStats]) => {
      const { data, success } = getValidatorsDataResponse;
      if (validatorStatistics) {
        const { statistics, success: validatorsSuccess } = validatorStats;
        const newState = populateValidatorsTable({ data, metaChainShardId, statistics });
        if (ref.current !== null) {
          setState({ success: success && validatorsSuccess, data: newState });
        }
      } else {
        const newState = populateValidatorsTable({ data, metaChainShardId });
        if (ref.current !== null) {
          setState({ success, data: newState });
        }
      }
    });
  };

  const showBrand = useLocation().pathname === '/validators/brand';
  console.log(showBrand);

  React.useEffect(getData, [nodeUrl, timeout]);

  return useMemo(
    () => (
      <div ref={ref}>
        <div className="container pt-3 pb-3">
          <div className="row">
            <div className="col-12">
              <h4 data-testid="title">Validators {showBrand ? ' Brand' : ''}</h4>
            </div>
          </div>
          {state.success ? (
            <>
              {state.data.validatorsAndObservers.length > 0 ? (
                <>
                  <ShardsList shardData={state.data.shardData} />

                  {showBrand
                    ? <ValidatorsBrandTable 
                        allValidators={state.data.validators} 
                      />
                    : <ValidatorsTable
                        {...state.data}
                        validatorStatistics={validatorStatistics}
                        validatorDetails={validatorDetails || false}
                      />
                  }
                </>
              ) : (
                <Loader />
              )}
            </>
          ) : (
            <div className="card">
              <div className="card-body card-details" data-testid="errorScreen">
                <div className="empty">
                  <FontAwesomeIcon icon={faCogs} className="empty-icon" />
                  <span className="h4 empty-heading">Unable to load validators</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    [state, validatorDetails, validatorStatistics, showBrand]
  );
};

export default Validators;
