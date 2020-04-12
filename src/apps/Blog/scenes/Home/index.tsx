import React, { useState } from 'react';
import { useAsyncEffect } from 'use-async-effect';
import { BasicList, Pagination } from '../../../../components';
import * as postProvider from '../../../../state/posts/postProvider';
import { AboutCard, PostCard } from '../../components';
import '../styles/styles.css';

const HomePage = ({ getPosts, postDispatch, postState }): JSX.Element => {
  // The max number of posts to fetch at a time.
  const POST_LIMIT = 8;

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [previousOffset, setPreviousOffset] = useState(-1);

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
    setPreviousOffset(offset - POST_LIMIT);
  };

  /**
   * The render callback that renders the post as a PostListItem.
   * @param post The post to display.
   */
  const renderPostCallback = (post: IPost): JSX.Element => {
    return <PostCard {...post} key={post.uuid} />;
  };

  useAsyncEffect(
    async () => {
      try {
        await fetchPosts(0);
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
    <div className='blog-container'>
      <div className='blog-flex-container'>
        <div className='blog-post-list'>
          <BasicList
            items={postState.posts}
            renderCallback={renderPostCallback}
          />
          <Pagination
            nextEnabled={postState.nextOffset > 0}
            previousEnabled={previousOffset >= 0}
            fetchNextItems={fetchNextPosts}
            fetchPreviousItems={fetchPreviousPosts}
          />
        </div>
        <aside className='blog-about-card'>
          <AboutCard />
        </aside>
      </div>
    </div>
  );
};

const ConnectedHomePage = (): JSX.Element => {
  const postDispatch = postProvider.usePostDispatch();
  const postState = postProvider.usePostState();
  return (
    <HomePage
      getPosts={postProvider.getPosts}
      postDispatch={postDispatch}
      postState={postState}
    />
  );
};

export default ConnectedHomePage;
