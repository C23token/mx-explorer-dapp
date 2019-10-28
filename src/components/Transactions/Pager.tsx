import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Pager: React.FC = () => {
  let { page } = useParams();
  const size = !isNaN(page as any) ? parseInt(page as any) : 1;

  return (
    <div className="float-right">
      {size === 1 ? (
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled
          data-testid="previousPageButton"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
      ) : (
        <Link
          to={`/transactions/page/${size - 1}`}
          className="btn btn-outline-secondary btn-sm"
          data-testid="nextPageButton"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Link>
      )}

      <span className="ml-1 mr-1">
        Page
        <span data-testid="pageNumber">{size}</span>
      </span>
      <Link
        data-testid="nextPageButton"
        to={`/transactions/page/${size + 1}`}
        className="btn btn-outline-secondary btn-sm"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </Link>
    </div>
  );
};

export default Pager;
