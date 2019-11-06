import React from 'react';
import { useParams } from 'react-router-dom';
import { faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from '../../context';
import { getAddressDetails } from './helpers/asyncRequests';
import { Denominate } from './../../sharedComponents';

type StateType = {
  address: string;
  code: string;
  balance: string;
  detailsFetched: boolean;
};

const initialState = {
  address: '',
  code: '',
  balance: '',
  detailsFetched: true,
};

const AddressDetails: React.FC = () => {
  let ref = React.useRef(null);
  let { hash: addressId } = useParams();
  const [state, setState] = React.useState<StateType>(initialState);

  const {
    activeTestnet: { nodeUrl },
    timeout,
  } = useGlobalState();

  React.useEffect(() => {
    if (addressId && ref.current !== null) {
      getAddressDetails({ nodeUrl, addressId, timeout }).then((data: any) => setState(data));
    }
  }, [nodeUrl, addressId, timeout]);

  const Address = (
    <div ref={ref}>
      <div>
        <div className="row">
          <div className="col-12">
            <h4>Address Details</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card">
              {!state.detailsFetched ? (
                <div className="card-body card-details">
                  <div className="empty">
                    <FontAwesomeIcon icon={faCube} className="empty-icon" />
                    <span className="h4 empty-heading">Unable to locate this address hash</span>
                    <span className="empty-details">{addressId}</span>
                  </div>
                </div>
              ) : (
                <div className="card-body">
                  <div className="row">
                    <div className="col-lg-1 card-label">Address</div>
                    <div className="col-lg-11">{addressId}</div>
                  </div>
                  <hr className="hr-space" />
                  <div className="row">
                    <div className="col-lg-1 card-label">Balance</div>
                    <div className="col-lg-11">
                      {state.balance && <Denominate value={state.balance} />}
                    </div>
                  </div>
                  {state.code && (
                    <>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-1 card-label">Code</div>
                        <div className="col-lg-11">
                          <textarea
                            readOnly
                            className="form-control col-lg-12 cursor-text"
                            rows={2}
                            defaultValue={state.code}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4" />
    </div>
  );
  return addressId ? Address : null;
};

export default AddressDetails;
