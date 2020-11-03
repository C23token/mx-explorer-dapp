import * as React from 'react';
import { DetailItem } from 'sharedComponents';
import PercentegeBar from './PercentegeBar';

export interface NetworkMetricsType {
  isValidator: boolean;
  isActive: boolean;
  totalUpTimePercentege: number;
  totalDownTimePercentege: number;
  totalUpTimeLabel: string;
  totalDownTimeLabel: string;
}

const NetworkMetrics = ({
  isValidator,
  isActive,
  totalUpTimePercentege,
  totalDownTimePercentege,
  totalUpTimeLabel,
  totalDownTimeLabel,
  rating,
}: NetworkMetricsType & { rating: number }) => {
  return (
    <div className="card card-small">
      <div className="card-header border-0 p-0">
        <div className="card-header-item border-bottom p-3">
          <h6 className="m-0">Network Metrics</h6>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="container-fluid">
          <DetailItem title="Rating" colWidth="3">
            {!isNaN(rating) ? rating : <span className="text-muted">N/A</span>}
          </DetailItem>

          <DetailItem title="Uptime" colWidth="3">
            <PercentegeBar
              totalDownTimeLabel={totalDownTimeLabel}
              totalUpTimeLabel={totalUpTimeLabel}
              totalUpTimePercentege={totalUpTimePercentege}
              totalDownTimePercentege={totalDownTimePercentege}
            />
          </DetailItem>

          <DetailItem title="Status" colWidth="3">
            {isActive ? (
              <div>
                <span className="badge badge-pill badge-success badge-status">&nbsp;</span>
                <span>&nbsp;Online</span>
              </div>
            ) : (
              <div>
                <span className="badge badge-pill badge-danger badge-status">&nbsp;</span>
                <span className={isValidator === false ? 'text-muted' : ''}>&nbsp;Offline</span>
              </div>
            )}
          </DetailItem>
        </div>
      </div>
    </div>
  );
};

export default NetworkMetrics;
