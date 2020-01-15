import { faCube } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useGlobalState } from '../../context';
import { BlocksTable, Loader, Pager, ShardSpan } from './../../sharedComponents';
import { getBlocks, getTotalBlocks } from './helpers/asyncRequests';

export interface BlockType {
  hash: string;
  nonce: number;
  prevHash: string;
  proposer: number;
  pubKeyBitmap: string;
  round: number;
  shardId: number;
  size: number;
  stateRootHash: string;
  timestamp: number;
  txCount: number;
  validators: number[];
}

interface StateType {
  blocks: BlockType[];
  startBlockNr: number;
  endBlockNr: number;
  blocksFetched: boolean;
}

const initialState = {
  blocks: [],
  startBlockNr: 0,
  endBlockNr: 0,
  blocksFetched: true,
};

const Blocks: React.FC = () => {
  const { page, shard } = useParams();
  const shardId = parseInt(shard!) >= 0 ? parseInt(shard!) : undefined;

  const ref = React.useRef(null);
  const size = !isNaN(page as any) ? parseInt(page as any) : 1;
  const [state, setState] = React.useState<StateType>(initialState);
  const [totalBlocks, setTotalBlocks] = React.useState<number | string>('...');

  const {
    activeTestnet: { elasticUrl },
    refresh: { timestamp },
    timeout,
  } = useGlobalState();

  const refreshFirstPage = size === 1 ? timestamp : 0;

  const fetchBlocks = () => {
    if (ref.current !== null) {
      getBlocks({ elasticUrl, size, shardId, timeout }).then(data => {
        if (ref.current !== null) {
          if (data.blocksFetched) {
            setState(data);
          } else if (state.blocks.length === 0) {
            setState({ ...initialState, blocksFetched: false });
          }
        }
      });
      getTotalBlocks({ elasticUrl, shardId, timeout }).then(({ count, success }) => {
        if (ref.current !== null && success) {
          setTotalBlocks(count);
        }
      });
    }
  };

  React.useEffect(fetchBlocks, [elasticUrl, size, shardId, timeout, refreshFirstPage]); // run the operation only once since the parameter does not change

  const Component = () => (
    <div ref={ref}>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4>
              <span data-testid="title">Blocks</span>&nbsp;
              {shardId !== undefined && shardId >= 0 && (
                <>
                  <ShardSpan shardId={shardId} />
                </>
              )}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {!state.blocksFetched ? (
              <div className="card">
                <div className="card-body card-details" data-testid="errorScreen">
                  <div className="empty">
                    <FontAwesomeIcon icon={faCube} className="empty-icon" />
                    <span className="h4 empty-heading">Unable to load blocks</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {state.blocks.length > 0 ? (
                  <div className="card">
                    <div className="card-body card-list">
                      <BlocksTable blocks={state.blocks} shardId={shardId} />
                      <Pager
                        slug={shardId ? `blocks/shards/${shardId}` : 'blocks'}
                        total={totalBlocks}
                        start={(size - 1) * 25 + (size === 1 ? 1 : 0)}
                        end={
                          (size - 1) * 25 +
                          (parseInt(totalBlocks.toString()) < 25
                            ? parseInt(totalBlocks.toString())
                            : 25)
                        }
                        show={state.blocks.length > 0}
                      />
                    </div>
                  </div>
                ) : (
                  <Loader />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return React.useMemo(Component, [timestamp, state.blocksFetched]);
};

export default Blocks;
