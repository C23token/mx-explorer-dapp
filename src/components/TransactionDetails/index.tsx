import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  faExchangeAlt,
  faHourglass,
  faCheckCircle,
  faFileCode,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { getTransaction } from './helpers/asyncRequests';
import { useCountState } from './../../context/context';
import { TransactionType } from '../Transactions';
import filters from './../../helpers/filters';

type StateType = {
  noTrxFoundTitle: string;
  fee: number;
};

const initialState = {
  noTrxFoundTitle: '',
  fee: 0,
};

const TransactionDetails: React.FC = () => {
  let { transactionId } = useParams();
  const { elasticUrl } = useCountState();
  const [state, useState] = React.useState<StateType>(initialState);
  const [transaction, useTransaction] = React.useState<TransactionType | undefined>(undefined);

  React.useEffect(() => {
    if (transactionId)
      getTransaction(elasticUrl, transactionId)
        .then(data => {
          if (!data.found) {
            useState({ ...state, noTrxFoundTitle: 'Unable to locate this transaction hash' });
          } else {
            const transaction: TransactionType = data._source;
            const fee = transaction.gasPrice * transaction.gasLimit;
            useState({ ...state, fee });
            useTransaction(transaction);
          }
        })
        .catch(() => {
          useState({ ...state, noTrxFoundTitle: 'Unable to locate this transaction hash' });
        });
  }, [elasticUrl]); // run the operation only once since the parameter does not change
  return (
    <div className="container pt-3 pb-3">
      <div ng-show="noTrxFoundTitle == ''" className="row">
        <div className="col-12">
          <h4>Transaction Details</h4>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="card">
            {state.noTrxFoundTitle && (
              <div ng-show="noTrxFoundTitle != ''" className="card-body card-details">
                <div className="empty">
                  <FontAwesomeIcon icon={faExchangeAlt} className="empty-icon" />
                  <span className="h4 empty-heading">{state.noTrxFoundTitle}</span>
                </div>
              </div>
            )}
            {transaction && (
              <div className="card-body card-details">
                <div className="row">
                  <div className="col-lg-2 card-label">Transaction Hash</div>
                  <div className="col-lg-10">{transaction.hash}</div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Status</div>
                  <div className="col-lg-10">
                    {transaction.status !== 'Success' && (
                      <FontAwesomeIcon icon={faHourglass} className="mr-2" />
                    )}
                    {transaction.status === 'Success' && (
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                    )}
                    {transaction.status}
                  </div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Timestamp</div>
                  <div className="col-lg-10">
                    <i className="fa fa-clock mr-2" />
                    {filters.timestampAge(transaction.timestamp * 1000)}
                    &nbsp;(
                    {moment(transaction.timestamp * 1000).format('MMM DD, YYYY HH:mm:ss A')})
                  </div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Block</div>
                  <div className="col-lg-10">{transaction.blockHash}</div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">From</div>
                  <div className="col-lg-10">
                    {transaction.sender.includes('00000000000000000000') && (
                      <FontAwesomeIcon icon={faFileCode} className="w300 mr-1" />
                    )}
                    <Link to={`/address/${transaction.sender}`}>{transaction.sender}</Link>
                    &nbsp;
                    <Link to={`shard/${transaction.senderShard}/page/1`} className="small-link">
                      (Shard ID {transaction.senderShard})
                    </Link>
                  </div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">To</div>
                  <div className="col-lg-10">
                    {transaction.receiver.includes('00000000000000000000') && (
                      <FontAwesomeIcon icon={faFileCode} className="w300 mr-1" />
                    )}
                    <Link to={`/address/${transaction.receiver}`}>{transaction.receiver}</Link>
                    &nbsp;
                    {Boolean(transaction.receiverShard) && (
                      <Link to={`shard/${transaction.receiverShard}/page/1`} className="small-link">
                        (Shard ID {transaction.receiverShard})
                      </Link>
                    )}
                  </div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Value</div>
                  <div className="col-lg-10">{transaction.value} ERD</div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Transaction Fee</div>
                  <div className="col-lg-10">{state.fee}</div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Nonce</div>
                  <div className="col-lg-10">{transaction.nonce}</div>
                </div>
                <hr className="hr-space" />
                <div className="row">
                  <div className="col-lg-2 card-label">Input Data</div>
                  <div className="col-lg-10">
                    <textarea
                      readOnly
                      className="form-control col-lg-12 cursor-text"
                      rows={2}
                      defaultValue={transaction.data}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
