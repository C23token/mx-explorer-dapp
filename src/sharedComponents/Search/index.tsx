import * as React from 'react';
import { faSearch } from '@fortawesome/pro-regular-svg-icons/faSearch';
import { faCircleNotch } from '@fortawesome/pro-regular-svg-icons/faCircleNotch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNetworkRoute } from 'helpers';
import { Redirect, useLocation } from 'react-router-dom';
import { adapter } from 'sharedComponents';
import { miniblock } from 'utils/rawData';

const Search = () => {
  const { pathname } = useLocation();
  const networkRoute = useNetworkRoute();
  const { isAddress, isBlock, isTransaction, getNode, getMiniBlock } = adapter();
  const [route, setRoute] = React.useState('');
  const [searching, setSearching] = React.useState(false);

  const [hash, setHash] = React.useState<string>('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearching(true);
      onClick();
    }
  };

  const onClick = async () => {
    Promise.all([
      getNode(hash),
      isBlock(hash),
      isTransaction(hash),
      isAddress(hash),
      getMiniBlock(hash),
    ]).then(([node, block, transaction, address, miniblock]) => {
      switch (true) {
        case node.success:
          setRoute(networkRoute(`/nodes/${hash}`));
          break;
        case block:
          setRoute(networkRoute(`/blocks/${hash}`));
          break;
        case transaction:
          setRoute(networkRoute(`/transactions/${hash}`));
          break;
        case address:
          setRoute(networkRoute(`/address/${hash}`));
          break;
        case miniblock.blockFetched:
          setRoute(networkRoute(`/miniblocks/${hash}`));
          break;
        default:
          setRoute(networkRoute(`/search/${hash}`));
          break;
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHash(e.target.value);
  };

  const reset = () => {
    if (route) {
      setRoute('');
    }
    if (hash) {
      setHash('');
    }
    if (searching) {
      setSearching(false);
    }
  };

  React.useEffect(reset, [route, pathname]);

  return route ? (
    <Redirect to={route} />
  ) : (
    <>
      <input
        type="text"
        className="form-control ml-3 pr-3"
        placeholder="Address / Txn Hash / Block Hash"
        name="requestType"
        data-testid="search"
        required
        value={hash}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <div className="input-group-prepend">
        <button
          type="submit"
          className="input-group-text"
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
          data-testid="searchButton"
        >
          {searching ? (
            <FontAwesomeIcon icon={faCircleNotch} spin />
          ) : (
            <FontAwesomeIcon icon={faSearch} />
          )}
        </button>
      </div>
    </>
  );
};

export default Search;
