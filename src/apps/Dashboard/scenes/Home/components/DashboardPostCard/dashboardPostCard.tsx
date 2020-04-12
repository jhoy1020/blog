import React, { useState } from 'react';
import { useAsyncEffect } from 'use-async-effect';
import {
  BasicList,
  CollapsibleCard,
  Pagination
} from '../../../../../../components';
import {
  deletePost,
  getPosts,
  usePostDispatch,
  usePostState
} from '../../../../../../state/posts/postProvider';
import DashboardListItem from '../DashboardListItem/dashboardListItem';

const DashboardPostCard = (): JSX.Element => {
  // The number of posts to fetch at a time.
  const POST_LIMIT = 15;

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [previousOffset, setPreviousOffset] = useState(-1);

  const postDispatch = usePostDispatch();
  const postState = usePostState();

  /**
   * Sends a request to the database to delete the specified
   * post.
   * @param postUUID The post's UUID.
   */
  const deletePostOnClick = async (postUUID: string): Promise<void> => {
    await deletePost(postDispatch, postUUID);
  };

  /**
   * Fetches the previous set of posts.
   */
  const fetchPreviousPosts = async (): Promise<void> => {
    await fetchPosts(previousOffset);
  };

  /**
   * Fetches the next set of posts.
   */
  const fetchNextPosts = async (): Promise<void> => {
    await fetchPosts(postState.nextOffset);
  };

  /**
   * Fetches a list of posts at the given offset.
   * @param offset The offset of the post to start the fetch at.
   */
  const fetchPosts = async (offset: number): Promise<void> => {
    await getPosts(postDispatch, POST_LIMIT, offset);
    setPreviousOffset(offset);
  };

  /**
   * Returns a DashboardListItem that renders the individual post
   * that is passed in.
   * @param post The post to render.
   */
  const renderPostCallback = (post: IPost): JSX.Element => {
    return (
      <DashboardListItem
        createdAt={post.createdAt}
        editLinkUrlPrefix='/dashboard/posts'
        key={post.uuid}
        uuid={post.uuid}
        title={post.title}
        onDeleteClick={deletePostOnClick}
      />
    );
  };

  useAsyncEffect(
    async () => {
      try {
        await fetchPosts(postState.nextOffset);
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
    <CollapsibleCard title='Posts'>
      <BasicList items={postState.posts} renderCallback={renderPostCallback} />
      <br />
      <Pagination
        nextEnabled={postState.nextOffset > 0}
        previousEnabled={previousOffset > 0}
        fetchNextItems={fetchNextPosts}
        fetchPreviousItems={fetchPreviousPosts}
      />
    </CollapsibleCard>
  );
};

export default DashboardPostCard;
