import React from 'react';
import { Link } from 'react-router-dom';
import { BasicButton } from '../../../../../../components';
import './styles/styles.css';

interface IDashboardListItemProps {
  createdAt?: Date;
  editLinkUrlPrefix?: string;
  uuid: string;
  title: string;
  onDeleteClick: (postUUID: string) => void;
}

/**
 * Renders an item's details for the dashboard.
 * @param createdAt The date the post was created.
 * @param editLinkUrlPrefix The prefix for the edit link for the edit url e.g /dashboard/post.
 * @param title The title of the post.
 * @param uuid The item's uuid.
 * @param onDeleteClick Is called when the delete link is called.
 */
const DashboardListItem = ({
  createdAt,
  editLinkUrlPrefix,
  uuid,
  title,
  onDeleteClick
}: IDashboardListItemProps): JSX.Element => {
  const dateString = createdAt ? new Date(createdAt).toDateString() : '';

  /**
   * Called when the delete button is clicked.
   */
  const handleDeleteOnClick = (): void => {
    onDeleteClick(uuid);
  };

  return (
    <div className='dashboard-item-container'>
      <div className='dashboard-item-header'>
        <div className='dashboard-item-info'>
          <h3>{title}</h3>
        </div>
        <div className='dashboard-item-info'>
          {editLinkUrlPrefix ? (
            <Link className='shared-link' to={`${editLinkUrlPrefix}/${uuid}`}>
              edit
            </Link>
          ) : null}
          <BasicButton
            className='shared-button-link'
            disabled={false}
            label='delete'
            onClick={handleDeleteOnClick}
          />
        </div>
      </div>
      <div className='dashboard-item-date'>{dateString}</div>
    </div>
  );
};

export default DashboardListItem;
