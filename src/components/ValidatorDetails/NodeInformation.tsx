import * as React from 'react';
import { TestnetLink, ShardSpan } from '../../sharedComponents';
import { truncate } from '../../helpers';

export type NodeInformationType = {
  publicKey: string;
  instanceType: number;
  shardNumber: number;
  versionNumber: string;
  nodeDisplayName: string;
  publicKeyBlockSign: string;
};

const NodeInformation = ({
  publicKey,
  instanceType,
  shardNumber,
  versionNumber,
  nodeDisplayName,
  publicKeyBlockSign,
}: NodeInformationType) => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-2 card-label">Public Key</div>
              <div className="col-lg-10">{truncate(publicKey, 100)}</div>
            </div>
            <hr className="hr-space" />
            {publicKeyBlockSign !== undefined && (
              <div ng-show="">
                <div className="row">
                  <div className="col-lg-2 card-label">Public key BlockSign</div>
                  <div className="col-lg-10">missing</div>
                </div>
                <hr className="hr-space" />
              </div>
            )}

            <div className="row">
              <div className="col-lg-2 card-label">Shard</div>
              <div className="col-lg-10">
                <TestnetLink to={`/blocks/shards/${shardNumber}`}>
                  <ShardSpan shardId={shardNumber} />
                </TestnetLink>
              </div>
            </div>
            <hr className="hr-space" />
            <div className="row">
              <div className="col-lg-2 card-label">Name</div>
              <div className="col-lg-10">
                {nodeDisplayName ? (
                  nodeDisplayName
                ) : (
                  <span className="text-muted" ng-show="!nodeDisplayName">
                    N/A
                  </span>
                )}
              </div>
            </div>
            <hr className="hr-space" />
            <div className="row">
              <div className="col-lg-2 card-label">Type</div>
              <div className="col-lg-10">{instanceType}</div>
            </div>
            <hr className="hr-space" />
            <div className="row">
              <div className="col-lg-2 card-label">Version</div>
              <div className="col-lg-10">{versionNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeInformation;
