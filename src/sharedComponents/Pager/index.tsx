import React from 'react';
import { useParams } from 'react-router-dom';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TestnetLink from './../TestnetLink';

const Pager = ({ slug }: { slug: string }) => {
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
        <TestnetLink
          to={`/${slug}/page/${size - 1}`}
          className="btn btn-outline-secondary btn-sm"
          data-testid="nextPageButton"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </TestnetLink>
      )}

      <span className="ml-1 mr-1">
        Page&nbsp;
        <span data-testid="pageNumber">{size}</span>
      </span>
      <TestnetLink
        data-testid="nextPageButton"
        to={`/${slug}/page/${size + 1}`}
        className="btn btn-outline-secondary btn-sm"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </TestnetLink>
    </div>
  );
};

export default Pager;
