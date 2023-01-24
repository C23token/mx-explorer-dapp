import React, { useEffect, useRef, useState } from 'react';

import { faChartBar } from '@fortawesome/pro-regular-svg-icons/faChartBar';

import { useSelector } from 'react-redux';
import { PageState, Chart, Loader, useAdapter } from 'components';
import { ChartConfigType } from 'components/Chart/helpers/types';
import { activeNetworkSelector } from 'redux/selectors';
import { ChartListType } from '../Analytics';

export interface AnalyticsChartDataType {
  value: string;
  timestamp: number;
}
export interface AnalyticsChartType {
  id: string;
  data: AnalyticsChartDataType[];
}

export const AnalyticsChart = ({ id, path }: ChartListType) => {
  const ref = useRef(null);

  const { id: activeNetworkId } = useSelector(activeNetworkSelector);
  const { getAnalyticsChart } = useAdapter();

  const [dataReady, setDataReady] = React.useState<boolean | undefined>();
  const [chart, setChart] = useState<AnalyticsChartDataType[]>([]);

  // Temporary ?
  const formatChartNameFomId = (id: string) => {
    const normalizedName = id.replace('-monthly', '').replaceAll('-', ' ');

    return normalizedName;
  };
  const formatChartLabelFomId = (id: string) => {
    const normalizedName = id
      .replace('-monthly', '')
      .replace('daily-', '')
      .replaceAll('-', ' ');

    return normalizedName;
  };
  const getChartPropsFromId = (id: string) => {
    switch (id) {
      case 'daily-total-staked-egld-monthly':
      case 'total-value-locked-plus-staking-monthly':
      case 'daily-fees-captured-monthly':
        return {
          currency: 'EGLD'
        };
      case 'daily-average-ape-monthly':
      case 'daily-base-ape-monthly':
      case 'daily-topup-ape-monthly':
        return {
          percentageMultiplier: 100
        };
      case 'daily-developer-rewards-monthly':
      case 'daily-inflation-monthly':
        return {
          denomination: 18,
          currency: 'EGLD'
        };
      case 'daily-new-smart-contracts-monthly':
      case 'daily-new-fungible-esdts-monthly':
      case 'daily-new-nonfungible-esdts-monthly':
      case 'daily-new-semifungible-esdts-monthly':
      case 'daily-new-meta-esdts-monthly':
      case 'daily-new-nfts-monthly':
      case 'number-of-blocks-created-per-day-monthly':
      case 'daily-number-of-active-users-monthly':
      case 'daily-number-of-address-to-address-transactions-monthly':
      case 'daily-number-of-address-to-contract-transactions-monthly':
      case 'daily-number-of-contract-to-address-transactions-monthly':
      case 'daily-number-of-contract-to-contract-transactions-monthly':
      case 'daily-number-of-token-transfers-monthly':
      default:
        return {};
    }
  };

  const config: ChartConfigType[] = [
    {
      id: formatChartLabelFomId(id),
      label: formatChartLabelFomId(id),
      gradient: 'defaultGradient',
      data: chart
    }
  ];

  const getData = () => {
    getAnalyticsChart(path).then((chart) => {
      if (chart.success) {
        const chartData = chart?.data;

        if (chartData?.data) {
          setChart(chartData.data);
        }
      }
      setDataReady(chart.success);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(getData, [activeNetworkId]);

  return (
    <>
      <section id={id} ref={ref} className='card'>
        <Chart.Heading
          title={formatChartNameFomId(id)}
          className='text-capitalize'
        ></Chart.Heading>
        <Chart.Body>
          {dataReady === undefined && <Loader />}
          {dataReady === false && (
            <PageState
              icon={faChartBar}
              title='Unable to load Chart'
              className='py-spacer my-auto'
              titleClassName='mt-0'
              dataTestId='accountsChartError'
            />
          )}
          {dataReady === true && chart.length === 0 && (
            <PageState
              icon={faChartBar}
              title='Missing Chart data'
              className='py-spacer my-auto'
              titleClassName='mt-0'
              dataTestId='accountsChartError'
            />
          )}

          {dataReady === true && chart.length > 0 && (
            <Chart.Bar
              {...{ config }}
              hasOnlyStartEndTick
              {...getChartPropsFromId(id)}
            ></Chart.Bar>
          )}
        </Chart.Body>
      </section>
    </>
  );
};
