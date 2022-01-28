import React from 'react';
import { Denominate, NetworkLink } from 'sharedComponents';
import { urlBuilder } from 'helpers';
import { denomination as configDenomination } from 'appConfig';

const TokenValue = ({ token }: { token: any }) => {
  const ref = React.useRef(null);
  const denomination = token.decimals !== undefined ? token.decimals : configDenomination;

  return (
    <div ref={ref} className="token-value d-flex flex-wrap">
      {token && (
        <>
          {token.value && (
            <div className="mr-1 text-truncate">
              <Denominate value={token.value} showLabel={false} denomination={denomination} />
            </div>
          )}
          <NetworkLink
            to={urlBuilder.tokenDetails(token.token)}
            className={`d-flex text-truncate ${token.svgUrl ? 'token-link' : ''}`}
          >
            <div className="d-flex align-items-center symbol text-truncate">
              {token.svgUrl && <img src={token.svgUrl} alt=" " className="token-icon mr-1" />}
              <span className="text-truncate">{token.ticker}</span>
            </div>
          </NetworkLink>
        </>
      )}
    </div>
  );
};

export default TokenValue;
