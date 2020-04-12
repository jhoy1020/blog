import React from 'react';
import { Redirect } from 'react-router';
import uuid from 'uuid';
import { CheckUserPermissions } from '../../../../../components';
import { history } from '../../../../../services/history/history';
import {
  createPost,
  usePostDispatch
} from '../../../../../state/posts/postProvider';
import * as userProvider from '../../../../../state/users/userProvider';
import { PostInputForm } from '../components/PostComponents';

/**
 * A default post settings.
 */
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
 * The new post page.
 */
const CreatePostPage = (): JSX.Element => {
  const postDispatch = usePostDispatch();

  /**
   * Creates a new post in the database.
   * @param newPost Creates a new post in the db.
   */
  const handleSubmitCallback = async (
    newPost: IPost,
    image: File
  ): Promise<void> => {
    await createPost(
      postDispatch,
      new Date(),
      image,
      true,
      uuid(),
      newPost.text,
      newPost.title
    );
    history.push('/dashboard');
  };

  return <PostInputForm post={defaultPost} onSubmit={handleSubmitCallback} />;
};

const AuthCreatePostPage = (): JSX.Element => {
  const userState = userProvider.useUserState();
  const userRole =
    userState && userState.user ? userState.user.role : 'visitor';
  return (
    <CheckUserPermissions
      role={userRole}
      action={'posts:create'}
      data={null}
      renderComponent={<CreatePostPage />}
      redirectComponent={<Redirect to='/' />}
    />
  );
};

export default AuthCreatePostPage;
