import * as React from 'react';
import Hero from './Hero';
import LatestBlocks from './LatestBlocks';
import LatestTransactions from './LatestTransactions';

const TransactionDetails = () => {
  return (
    <div>
      <Hero />
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-lg-6 mt-4 mb-4">
            <LatestBlocks />
          </div>
          <div className="col-lg-6 mt-4 mb-4">
            <LatestTransactions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
