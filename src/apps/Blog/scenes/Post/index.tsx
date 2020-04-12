import React, { useState } from 'react';
import { useAsyncEffect } from 'use-async-effect';
import { BasicList, GithubLoginButton } from '../../../../components';
import { history } from '../../../../services/history/history';
import * as postProvider from '../../../../state/posts/postProvider';
import * as userProvider from '../../../../state/users/userProvider';
import { CommentCard, CreateCommentCard, PostDetails } from '../../components';
import '../styles/styles.css';

const PostDisplayPage = ({
  createComment,
  deleteComment,
  getComments,
  getPost,
  gitHubLogin,
  post,
  postDispatch,
  postUUID,
  userDispatch,
  userState,
}): JSX.Element => {
  // Component's local state.
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID as string;
  const githubScope = process.env.REACT_APP_GITHUB_SCOPE as string;
  const redirectUrl = process.env.REACT_APP_REDIRECT_URL as string;

  /**
   * Deletes a comment from the database and from state.
   * @param commentUUID The comment's uuid.
   */
  const handleDeleteCommentClick = async (
    commentUUID: string
  ): Promise<void> => {
    if (!post) {
      return;
    }
    await deleteComment(postDispatch, commentUUID, post.uuid);
  };

  /**
   * Adds a new comment for the post.
   * @param comment The new comment.
   * @param postUUID The uuid of the post.
   */
  const handleNewCommentSubmit = async (
    comment: IComment,
    postUUID: string
  ): Promise<void> => {
    await createComment(
      postDispatch,
      comment.uuid,
      comment.createdAt,
      postUUID,
      comment.text
    );
  };

  const onFailureOfGithubLogin = (data: any): void => {
    // popup?
  };

  /**
   * Is called when the user successfully logins into github.
   * @param token The github access token.
   */
  const onSuccessfulGithubLogin = async (token: string): Promise<void> => {
    await gitHubLogin(userDispatch, token);
    window.scrollTo(0, document.body.scrollHeight);
  };

  /**
   * Renders a CommentDetails component for the comment.
   * @param comment The comment to render.
   */
  const renderCommentCallback = (comment: IComment): any => {
    return !comment.visitor ? null : (
      <CommentCard
        key={comment.uuid}
        comment={comment}
        visitor={userState.user}
        onDeleteClick={handleDeleteCommentClick}
      />
    );
  };

  useAsyncEffect(
    async () => {
      try {
        if (!postUUID) {
          history.push('/');
        }
        if (!post) {
          await getPost(postDispatch, postUUID);
        }
        if (post && (!post.comments || post.comments.length === 0)) {
          await getComments(postDispatch, postUUID);
        }
      } catch (e) {
        setError(e.message || 'Unexpected error');
      }
      setLoading(false);
    },
    () => {
      /* No Empty Braces. */
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
      <PostDetails post={post} key={post ? post.uuid : ''} />
      <hr className='post-details-border' />
      <div>
        {!userState.isAuthenticated ? (
          <GithubLoginButton
            buttonText='Sign in to leave a comment'
            githubClientId={githubClientId}
            githubScope={githubScope}
            redirectUrl={redirectUrl}
            onSuccessCallback={onSuccessfulGithubLogin}
            onFailureCallback={onFailureOfGithubLogin}
          />
        ) : (
          <h5 style={{ marginTop: 30 }}>Comments</h5>
        )}
      </div>
      <BasicList
        items={post ? post.comments : []}
        renderCallback={renderCommentCallback}
      />
      <div style={{ width: 700, marginTop: '25px' }}>
        {userState.isAuthenticated && userState.user ? (
          <CreateCommentCard
            postUUID={post ? post.uuid : ''}
            userInfo={userState.user}
            onSaveCallback={handleNewCommentSubmit}
          />
        ) : null}
      </div>
    </div>
  );
};

const ConnectedPostDisplayPage = (props: any): JSX.Element => {
  const postDispatch = postProvider.usePostDispatch();
  const postState = postProvider.usePostState();
  const userDispatch = userProvider.useUserDispatch();
  const userState = userProvider.useUserState();

  const postUUID = props.match.params.uuid;
  const post = postState.posts.find((p) => p.uuid === postUUID);

  return (
    <PostDisplayPage
      createComment={postProvider.createCommentForPost}
      deleteComment={postProvider.deleteCommentFromPost}
      getComments={postProvider.getComments}
      getPost={postProvider.getPost}
      gitHubLogin={userProvider.gitHubLogin}
      post={post}
      postDispatch={postDispatch}
      postUUID={postUUID}
      userDispatch={userDispatch}
      userState={userState}
    />
  );
};

export default ConnectedPostDisplayPage;
