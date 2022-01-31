import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExchange, faSearch } from '@fortawesome/pro-regular-svg-icons';
import { Denominate, CopyButton, Trim, NetworkLink, DataDecode } from 'sharedComponents';
import { ResultType, TransactionTokensType } from 'helpers/types';
import { transactionsRoutes } from 'routes';
import decodePart from './decodePart';

const ScResultsList = ({
  results,
  transactionTokens,
}: {
  results: ResultType[];
  transactionTokens?: TransactionTokensType;
}) => {
  const { hash } = useLocation();
  const ref = React.useRef<HTMLDivElement>(null);
  const formattedHash = hash
    .substring(0, hash.indexOf('/') > 0 ? hash.indexOf('/') : hash.length)
    .replace('#', '');
  const initialDecodeMethod = hash.indexOf('/') > 0 ? hash.substring(hash.indexOf('/')) : 'raw';
  const [decodeMethod, setDecodeMethod] = React.useState<string>(
    initialDecodeMethod && ['raw', 'text', 'decimal', 'smart'].includes(initialDecodeMethod)
      ? initialDecodeMethod
      : 'raw'
  );

  const decodeData = (data: string) => {
    const parts = Buffer.from(data, 'base64').toString().split('@');

    if (parts.length >= 2) {
      if (parts[0].length > 0) {
        parts[0] = decodePart(parts[0]);
      } else {
        parts[1] = decodePart(parts[1]);
      }
    }

    return parts.join('@');
  };

  React.useEffect(() => {
    if (ref.current && ref.current !== null) {
      window.scrollTo({
        top: ref.current.getBoundingClientRect().top - 70,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <div className="sc-results-list detailed-list d-flex flex-column mt-1">
      {results.map((result: ResultType, i) => {
        const highlightTx = formattedHash === result.hash;
        return (
          <div
            key={i}
            id={result.hash}
            className={`detailed-item d-flex border-left border-bottom ml-3 py-3 ${
              highlightTx ? 'highlighted' : ''
            }`}
            {...(highlightTx ? { ref: ref } : {})}
          >
            <div className="transaction-icon">
              <FontAwesomeIcon icon={faExchange} />
            </div>

            <div className="detailed-item-content">
              {result.hash && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">Hash</div>
                  <div className="col d-flex align-items-center">
                    <Trim text={result.hash} />

                    <NetworkLink
                      to={`${transactionsRoutes.transactions}/${result.originalTxHash}#${result.hash}/${decodeMethod}`}
                      className="side-action ml-2"
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </NetworkLink>
                  </div>
                </div>
              )}

              {result.sender && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">From</div>
                  <div className="col d-flex align-items-center">
                    <Trim text={result.sender} />
                    <CopyButton text={result.sender} className="side-action ml-2" />
                  </div>
                </div>
              )}

              {result.receiver && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">To</div>
                  <div className="col d-flex align-items-center">
                    <Trim text={result.receiver} />
                    <CopyButton text={result.receiver} className="side-action ml-2" />
                  </div>
                </div>
              )}

              {result.value !== undefined && (
                <div className="row mb-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">Value</div>
                  <div className="col text-wrap">
                    <Denominate value={result.value} showLastNonZeroDecimal />
                  </div>
                </div>
              )}

              {result.data && (
                <div className="row d-flex flex-column flex-sm-row">
                  <div className="col col-left">Data</div>
                  <div className="col">
                    <DataDecode
                      value={result.data ? decodeData(result.data) : 'N/A'}
                      transactionTokens={transactionTokens}
                      {...(highlightTx ? { initialDecodeMethod, setDecodeMethod } : {})}
                    />
                  </div>
                </div>
              )}

              {result.returnMessage && (
                <div className="row mt-3 d-flex flex-column flex-sm-row">
                  <div className="col col-left">Response</div>
                  <div className="col text-break-all">{result.returnMessage}</div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScResultsList;
