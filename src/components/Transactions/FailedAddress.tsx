import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faWallet } from '@fortawesome/free-solid-svg-icons';
import { useGlobalState } from 'context';

export default function FailedAddress({ addressId }: { addressId: string | undefined }) {
  const {
    activeTestnet: { numInitCharactersForScAddress },
  } = useGlobalState();

  const showIcon =
    numInitCharactersForScAddress > 0 &&
    String(addressId).startsWith('0'.repeat(numInitCharactersForScAddress));

  return (
    <>
      <div className="row">
        <div className="col-12">
          <h4 data-testid="title">Address</h4>
        </div>
      </div>
      <div className="card">
        <div className="card-body card-details" data-testid="errorScreen">
          <div className="empty">
            <FontAwesomeIcon icon={showIcon ? faCode : faWallet} className="empty-icon" />
            <span className="h4 empty-heading">Unable to locate this address hash</span>
            <span className="empty-details">{addressId}</span>
          </div>
        </div>
      </div>
    </>
  );
}
