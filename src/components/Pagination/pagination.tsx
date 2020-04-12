import React from 'react';
import BasicButton from '../BasicComponents/components/BasicButton/basicButton';
import './styles/styles.css';

interface IPaginationProps {
  nextEnabled: boolean;
  previousEnabled: boolean;
  fetchPreviousItems: () => void;
  fetchNextItems: () => void;
}

/**
 * A paging component to navigate through a list of items.
 * @param nextEnabled Indicates if the next button is enabled.
 * @param previousEnabled Indicates if the previous button is enabled.
 * @param fetchNextItems A callback to fetch the next set of items.
 * @param fetchPreviousItems A callback to fetch the previous set of items.
 */
const Pagination = ({
  nextEnabled,
  previousEnabled,
  fetchPreviousItems,
  fetchNextItems
}: IPaginationProps): JSX.Element => {
  return (
    <div className='pagination-container'>
      <div>
        <div style={{ display: !previousEnabled ? 'none' : 'block' }}>
          {fetchPreviousItems && (
            <BasicButton
              className='shared-button'
              disabled={!previousEnabled}
              label='newer'
              onClick={fetchPreviousItems}
            />
          )}
        </div>
      </div>
      <div>
        <div style={{ display: !nextEnabled ? 'none' : 'block' }}>
          {fetchNextItems && (
            <BasicButton
              className='shared-button'
              disabled={!nextEnabled}
              label='older'
              onClick={fetchNextItems}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
