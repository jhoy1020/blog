import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { useAsyncEffect } from 'use-async-effect';
import { BasicList, CheckUserPermissions } from '../../../../../components';
import { history } from '../../../../../services/history/history';
import {
  deleteCommentFromPost,
  editPost,
  getComments,
  getPost,
  usePostDispatch,
  usePostState
} from '../../../../../state/posts/postProvider';
import * as userProvider from '../../../../../state/users/userProvider';
import { CommentCard, PostInputForm } from '../components/PostComponents';

const defaultPost: IPost = {
  comments: [],
  createdAt: new Date(),
  imageUrl: '',
  text: '',
  title: '',
  updatedAt: '',
  uuid: ''
};

/**
 * The edit post page.
 * @param props The parameters passed in by the url.
 */
const EditPostPage = (props: any): JSX.Element => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const postDispatch = usePostDispatch();
  const postState = usePostState();

  const postUUID = props.match.params.uuid;
  if (!postUUID) {
    history.push('/');
  }

  const post = postState.posts.find(p => p.uuid === postUUID);

  /**
   * Deletes a comment from the database and from state.
   * @param commentUUID The comment's uuid.
   */
  const handleDeleteCommentClick = async (
    commentUUID: string
  ): Promise<void> => {
    await deleteCommentFromPost(postDispatch, commentUUID, postUUID);
  };

  /**
   * Updates a post with it's new data.
   * @param post The updated post.
   */
  const handleSubmitCallback = async (
    updatePost: IPost,
    image: File
  ): Promise<void> => {
    await editPost(postDispatch, image, post || defaultPost, updatePost);
    history.push('/dashboard');
  };

  /**
   * Renders the details of a comment.
   * @param comment The comment to render.
   */
  const renderCommentCallback = (comment: IComment): JSX.Element => {
    return (
      <CommentCard
        key={comment.uuid}
        comment={comment}
        onDeleteClick={handleDeleteCommentClick}
      />
    );
  };

  useAsyncEffect(
    async () => {
      try {
        if (!post) {
          await getPost(postDispatch, postUUID);
        }
        if (post && (!post.comments || post.comments.length === 0)) {
          getComments(postDispatch, postUUID);
        }
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
    <div>
      <PostInputForm
        post={post || defaultPost}
        onSubmit={handleSubmitCallback}
      />
      <div style={{ marginTop: 30, marginBottom: 20 }}>
        <h2>Comments</h2>
      </div>
      <BasicList
        items={post ? post.comments : defaultPost.comments}
        renderCallback={renderCommentCallback}
      />
    </div>
  );
};

const AuthEditPostPage = (props: any): JSX.Element => {
  const userState = userProvider.useUserState();
  const userRole =
    userState && userState.user ? userState.user.role : 'visitor';
  return (
    <CheckUserPermissions
      role={userRole}
      action={'posts:edit'}
      data={null}
      renderComponent={<EditPostPage {...props} />}
      redirectComponent={<Redirect to='/' />}
    />
  );
};

export default AuthEditPostPage;
