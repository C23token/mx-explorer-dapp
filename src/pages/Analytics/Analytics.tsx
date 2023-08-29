import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Loader, Tabs } from 'components';
import { ChartListType } from 'components/Chart/helpers/types';
import { useAdapter, useIsMainnet, useNetworkRoute } from 'hooks';

import { AnalyticsChart } from 'pages/AnalyticsCompare/AnalyticsChart';
import { FailedAnalytics } from 'pages/AnalyticsCompare/components/FailedAnalytics';
import { NoAnalytics } from 'pages/AnalyticsCompare/components/NoAnalytics';
import { ChartContractsTransactions } from 'pages/Home/components/ChartContractsTransactions';
import { activeNetworkSelector } from 'redux/selectors';
import { analyticsRoutes } from 'routes';
import { MostUsed } from 'widgets';

import { ChartWrapper } from './components/ChartWrapper';

export const Analytics = () => {
  const navigate = useNavigate();
  const networkRoute = useNetworkRoute();
  const isMainnet = useIsMainnet();

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { getAnalyticsChartList } = useAdapter();

  const [dataReady, setDataReady] = useState<boolean | undefined>();
  const [chartList, setChartList] = useState<ChartListType[]>([]);

  const getData = () => {
    getAnalyticsChartList().then((chartList) => {
      if (chartList.success) {
        const chartData = chartList?.data;

        if (chartData) {
          setChartList(chartData);
        }
      }
      setDataReady(chartList.success);
    });
  };

  // const transactionsChart = useMemo(() => {
  //   return chartList?.filter((sc) => sc.id.includes('-transactions'));
  // }, [chartList]);

  const tokenTransfersChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('token-transfers'));
  }, [chartList]);

  const nftTransferChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('nft-transfers'));
  }, [chartList]);

  const dailyActiveUsersChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id === 'active-users');
  }, [chartList]);

  const networkAndDeveloperFeesChart = useMemo(() => {
    const charts = chartList?.filter(
      (sc) =>
        sc.id.includes('fees-captured') || sc.id.includes('developer-rewards')
    );

    if (charts.length === 2) {
      charts[1].dappConfig = {
        ...charts[1].dappConfig,
        id: 'right-axis',
        orientation: 'right'
      };
    }

    return charts;
  }, [chartList]);

  const newSmartContractsCreatedChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('new-smart-contracts'));
  }, [chartList]);

  const newStuffCreatedChart = useMemo(() => {
    let smartContractChartChart: ChartListType | null = null;

    if (newSmartContractsCreatedChart.length > 0) {
      smartContractChartChart = newSmartContractsCreatedChart[0];
      smartContractChartChart.dappConfig = {
        ...smartContractChartChart.dappConfig,
        id: 'right-axis',
        orientation: 'right'
      };
    }

    const charts = chartList?.filter(
      (sc) => sc.id.includes('new-nfts') || sc.id.includes('new-esdts')
    );

    if (charts.length === 2) {
      charts[1].dappConfig = {
        ...charts[1].dappConfig,
        id: 'right-axis',
        orientation: 'right'
      };
    }

    if (smartContractChartChart) {
      return [...charts, smartContractChartChart];
    }

    return charts;
  }, [chartList, newSmartContractsCreatedChart]);

  const aprsChart = useMemo(() => {
    return chartList?.filter((sc) => sc.id.includes('-apr'));
  }, [chartList]);

  const stakingMetricsChart = useMemo(() => {
    const charts = chartList?.filter((sc) =>
      sc.id.endsWith('staking-total-value-locked-plus-staking')
    );

    const rightYAxisSeriesIds = [
      'staking-delegated-stake',
      'staking-active-staked',
      'staking-total-value-locked-plus-staking'
    ];

    const all = charts.reduce((acc, curr) => {
      if (curr.id.endsWith('staking-total-value-locked-plus-staking')) {
        if (rightYAxisSeriesIds.includes(curr.id)) {
          curr.dappConfig = {
            ...curr.dappConfig,
            id: 'right-axis',
            orientation: 'right'
          };
        }

        acc.push(curr);
      }

      return acc;
    }, [] as ChartListType[]);

    return all;
  }, [chartList]);

  const usersStakingChart = useMemo(() => {
    const charts = chartList?.filter((sc) => sc.id.endsWith('users-staking'));

    const rightYAxisSeriesIds = [
      'staking-delegated-stake',
      'staking-active-staked',
      'staking-total-value-locked-plus-staking'
    ];

    const all = charts.reduce((acc, curr) => {
      if (curr.id.endsWith('users-staking')) {
        if (rightYAxisSeriesIds.includes(curr.id)) {
          curr.dappConfig = {
            ...curr.dappConfig,
            id: 'right-axis',
            orientation: 'right'
          };
        }

        acc.push(curr);
      }

      return acc;
    }, [] as ChartListType[]);

    return all;
  }, [chartList]);

  const usersChart = useMemo(() => {
    const charts = chartList?.filter(
      (sc) => sc.id.includes('accounts-balance') || sc.id === 'accounts'
    );
    return charts;
  }, [chartList]);

  const tabs = [
    {
      tabLabel: 'Key Metrics',
      tabTo: analyticsRoutes.analytics
    },
    {
      tabLabel: 'Compare',
      tabTo: analyticsRoutes.compare
    }
  ];

  useEffect(getData, [activeNetworkId]);

  if (!isMainnet) {
    navigate(networkRoute('/'));
  }

  if (dataReady === undefined) return <Loader />;
  if (!dataReady) return <FailedAnalytics />;
  if (dataReady && chartList.length === 0) return <NoAnalytics />;

  return (
    <div className='analytics container page-content'>
      <div className='card card-lg card-black'>
        <div className='card-header'>
          <Tabs tabs={tabs} />
        </div>
        <div className='card-body d-flex justify-content-between flex-wrap'>
          {/* <ChartWrapper>
            <div className='px-3 p-3'>
              <AnalyticsChart
                title={'Transactions Metrics'}
                series={transactionsChart}
                stacked={true}
                stackedLabel={'Total Transactions'}
              />
            </div>
          </ChartWrapper> */}

          <ChartWrapper>
            <div className='px-3 pb-3'>
              <ChartContractsTransactions />
            </div>
          </ChartWrapper>
          <ChartWrapper size='half'>
            <div className='px-3 pb-3'>
              <AnalyticsChart
                title={'Token Transactions'}
                series={tokenTransfersChart}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper size='half'>
            <div className='px-3 pb-3'>
              <AnalyticsChart
                title={'NFT Transactions'}
                series={nftTransferChart}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper>
            <div className='px-3 p-3'>
              <AnalyticsChart
                title={'Total Accounts'}
                series={usersChart}
                customDomain={true}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper>
            <div className='px-3 pb-3'>
              <AnalyticsChart series={dailyActiveUsersChart} />
            </div>
          </ChartWrapper>

          <ChartWrapper>
            <div className='mt-n4 px-3 pb-3'>
              <MostUsed />
            </div>
          </ChartWrapper>

          <ChartWrapper>
            <div className='px-3 pb-3'>
              <AnalyticsChart
                title={'New Applications Deployed'}
                series={newStuffCreatedChart}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper size='half'>
            <div className='px-3 p-3'>
              <AnalyticsChart
                title={'Staking Metrics'}
                series={stakingMetricsChart}
                customDomain={true}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper size='half'>
            <div className='px-3 p-3'>
              <AnalyticsChart
                title={'Users Staking'}
                series={usersStakingChart}
                customDomain={true}
              />
            </div>
          </ChartWrapper>
          <ChartWrapper size='half'>
            <div className='px-3 pb-3'>
              <AnalyticsChart title='APR Metrics' series={aprsChart} />
            </div>
          </ChartWrapper>
          <ChartWrapper size='half'>
            <div className='px-3 pb-3'>
              <AnalyticsChart
                title={'Fees Metrics'}
                series={networkAndDeveloperFeesChart}
              />
            </div>
          </ChartWrapper>
        </div>
      </div>
    </div>
  );
};
