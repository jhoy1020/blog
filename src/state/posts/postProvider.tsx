import React, { createContext, Dispatch, useContext, useReducer } from 'react';
import blogApi from '../../services/api';
import * as actions from './actions';

interface IPostProviderProps {
  children: React.ReactNode;
  initialState: IPostState;
  reducers: any;
}

const PostDispatchContext = createContext<Dispatch<IAction> | undefined>(
  undefined
);

const PostContext = createContext<IPostState | undefined>(undefined);

const PostProvider = ({
  children,
  initialState,
  reducers
}: IPostProviderProps) => {
  const [state, dispatch] = useReducer(reducers, initialState);
  return (
    <PostContext.Provider value={state as IPostState}>
      <PostDispatchContext.Provider value={dispatch}>
        {children}
      </PostDispatchContext.Provider>
    </PostContext.Provider>
  );
};

const createCommentForPost = async (
  dispatch: Dispatch<IAction>,
  commentUUID: string,
  createdAt: Date,
  postUUID: string,
  text: string
): Promise<void> => {
  const comment = await blogApi.createComment(
    commentUUID,
    createdAt,
    postUUID,
    text
  );
  dispatch(actions.addComment(postUUID, comment));
};

const createPost = async (
  dispatch: Dispatch<IAction>,
  createdAt: Date,
  image: File,
  isPublished: boolean,
  postUUID: string,
  text: string,
  title: string
): Promise<void> => {
  const imageUrl = await blogApi.uploadImage(image);
  const post = await blogApi.createPost(
    createdAt,
    imageUrl,
    isPublished,
    postUUID,
    text,
    title
  );
  dispatch(actions.addPost(post));
};

const deleteCommentFromPost = async (
  dispatch: Dispatch<IAction>,
  commentUUID: string,
  postUUID: string
): Promise<void> => {
  await blogApi.deleteComment(commentUUID, postUUID);
  dispatch(actions.deleteComment(commentUUID, postUUID));
};

const deletePost = async (
  dispatch: Dispatch<IAction>,
  postUUID: string
): Promise<void> => {
  await blogApi.deletePost(postUUID);
  dispatch(actions.deletePost(postUUID));
};

const editPost = async (
  dispatch: Dispatch<IAction>,
  image: File,
  originalPost: IPost,
  updatedPost: IPost
): Promise<void> => {
  // If a new image is given upload it and update the post, otherwise use the
  // current one.
  const imageUrl = !image
    ? originalPost.imageUrl
    : await blogApi.uploadImage(image);
  const post = await blogApi.editPost(
    imageUrl,
    true,
    originalPost.uuid,
    updatedPost.text,
    updatedPost.title
  );
  dispatch(actions.updatePost(post));
};

const getComments = async (
  dispatch: Dispatch<IAction>,
  postUUID: string
): Promise<void> => {
  const comments = await blogApi.getComments(postUUID);
  dispatch(actions.updateComments(postUUID, comments));
};

const getPost = async (
  dispatch: Dispatch<IAction>,
  postUUID: string
): Promise<void> => {
  const post = await blogApi.getPost(postUUID);
  dispatch(actions.addPost(post));
};

const getPosts = async (
  dispatch: Dispatch<IAction>,
  limit: number,
  offset: number
): Promise<void> => {
  const response = await blogApi.getPosts(limit, offset);
  dispatch(actions.updateNextOffset(response.nextOffset));
  dispatch(actions.updatePosts(response.posts));
};

const usePostState = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('');
  }
  return context;
};

const usePostDispatch = () => {
  const context = useContext(PostDispatchContext);
  if (!context) {
    throw new Error('');
  }
  return context;
};

export {
  PostProvider,
  createCommentForPost,
  createPost,
  deleteCommentFromPost,
  deletePost,
  editPost,
  getComments,
  getPost,
  getPosts,
  usePostDispatch,
  usePostState
};
