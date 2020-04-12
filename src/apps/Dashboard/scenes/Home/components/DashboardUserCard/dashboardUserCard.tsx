import React, { useState } from 'react';
import { useAsyncEffect } from 'use-async-effect';
import {
  BasicList,
  CollapsibleCard,
  Pagination
} from '../../../../../../components';
import blogApi from '../../../../../../services/api';
import DashboardListItem from '../DashboardListItem/dashboardListItem';

const DashboardUserCard = (): JSX.Element => {
  // The number of users to fetch at a time.
  const userLimit = 15;

  // Component's local state.
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [previousOffset, setPreviousOffset] = useState(-1);
  const [nextOffset, setNextOffset] = useState(0);
  const [localUsers, setLocalUsers] = useState([] as IUser[]);

  /**
   * Sends a request to the database to delete the specified
   * user.
   * @param userUUID The user's UUID.
   */
  const deleteVisitorOnClick = async (userUUID: string): Promise<void> => {
    await blogApi.deleteVisitor(userUUID);
    setLocalUsers(localUsers.filter(u => u.uuid !== userUUID));
  };

  /**
   * Fetches the previous set of users.
   */
  const fetchPreviousUser = async (): Promise<void> => {
    await fetchUsers(previousOffset);
  };

  /**
   * Fetches the next set of users.
   */
  const fetchNextUser = async (): Promise<void> => {
    await fetchUsers(nextOffset);
  };

  /**
   * Fetches a list of users at the given offset.
   * @param offset The offset of the post to start the fetch at.
   */
  const fetchUsers = async (offset: number): Promise<void> => {
    const response = await blogApi.getVisitors(offset, userLimit);
    setNextOffset(response.nextOffset);
    setPreviousOffset(offset - userLimit);
    setLocalUsers(response.users || []);
  };

  /**
   * Returns a DashboardListItem that renders the individual user
   * that is passed in.
   * @param user The user to render.
   */
  const renderUserCallback = (user: IUser): JSX.Element => {
    return (
      <DashboardListItem
        uuid={user.uuid}
        title={user.username}
        onDeleteClick={deleteVisitorOnClick}
        key={user.uuid}
      />
    );
  };

  useAsyncEffect(
    async () => {
      try {
        await fetchUsers(nextOffset);
      } catch (e) {
        setError(e.message || 'Unexpected error');
      }
      setLoading(false);
    },
    () => {
      /* Nothing to do here. */
    },
    []
  );

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>ERROR: {error}</div>;
  }

  return (
    <CollapsibleCard title='Users'>
      <BasicList items={localUsers} renderCallback={renderUserCallback} />
      <br />
      <Pagination
        nextEnabled={nextOffset > 0}
        previousEnabled={previousOffset >= 0}
        fetchNextItems={fetchNextUser}
        fetchPreviousItems={fetchPreviousUser}
      />
    </CollapsibleCard>
  );
};

export default DashboardUserCard;
