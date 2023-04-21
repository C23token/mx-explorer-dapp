import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Loader } from 'components';
import { useAdapter, useGetPage, useGetHash } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { setNft } from 'redux/slices';

import { FailedNftDetails } from './FailedNftDetails';
import { NftDetailsCard } from './NftDetailsCard';

export const NftLayout = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const { firstPageRefreshTrigger } = useGetPage();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const dispatch = useDispatch();
  const { getNft } = useAdapter();

  const identifier = useGetHash();

  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchNftDetails = () => {
    if (identifier) {
      getNft(identifier).then((nftDetailsData) => {
        if (ref.current !== null) {
          if (nftDetailsData.success && nftDetailsData?.data) {
            dispatch(setNft(nftDetailsData.data));
            setDataReady(true);
          }

          if (dataReady === undefined) {
            setDataReady(nftDetailsData.success);
          }
        }
      });
    }
  };

  useEffect(() => {
    fetchNftDetails();
  }, [firstPageRefreshTrigger, activeNetworkId, identifier]);

  const loading = dataReady === undefined;
  const failed = dataReady === false;

  return (
    <>
      {loading && <Loader />}
      {!loading && failed && <FailedNftDetails identifier={identifier} />}

      <div ref={ref}>
        {!loading && !failed && (
          <div className='container page-content'>
            <NftDetailsCard />
            {children}
          </div>
        )}
      </div>
    </>
  );
};
