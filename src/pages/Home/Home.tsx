import * as React from 'react';

import { useIsMainnet } from 'hooks';
import { MostUsed } from 'widgets';

import { ChartContractsTransactions } from './ChartContractsTransactions';
import { ChartPrice } from './ChartPrice';
import { ChartStake } from './ChartStake';
import { EconomicsCard } from './EconomicsCard';
import { HeroCard } from './HeroCard';
import { LatestBlocks } from './LatestBlocks';
import { LatestTransactions } from './LatestTransactions';

export const Home = () => {
  const isMainnet = useIsMainnet();

  return (
    <div className='home page-content container'>
      <HeroCard />

      {isMainnet && (
        <>
          <div className='d-xl-flex mt-3'>
            <ChartPrice />
            <ChartStake />
            <EconomicsCard />
          </div>

          <ChartContractsTransactions />
          <MostUsed />
        </>
      )}

      <div className='row'>
        <div className='col-12 mt-3'>
          <LatestBlocks />
        </div>
        <div className='col-12 mt-3'>
          <LatestTransactions />
        </div>
      </div>
    </div>
  );
};
