import * as actions from './actions';

/**
 * The post reducer that is called when a post action is called.
 * @param state The current state.
 * @param action The action to take.
 */
export const PostReducer = (
  postState: IPostState,
  action: IAction
): IPostState => {
  switch (action.type) {
    case actions.ADD_POST:
      return {
        ...postState,
        posts: [...postState.posts, action.payload.post]
      };
    case actions.ADD_COMMENT:
      return {
        ...postState,
        posts: addComment(
          postState.posts,
          action.payload.postUUID,
          action.payload.comment
        )
      };
    case actions.DELETE_COMMENT:
      return {
        ...postState,
        posts: deleteComment(
          postState.posts,
          action.payload.commentUUID,
          action.payload.postUUID
        )
      };
    case actions.DELETE_POST:
      return {
        ...postState,
        posts: postState.posts.filter(p => p.uuid !== action.payload.postUUID)
      };
    case actions.UPDATE_COMMENTS:
      return {
        ...postState,
        posts: postState.posts.map(post => {
          return post.uuid === action.payload.postUUID
            ? { ...post, comments: action.payload.comments }
            : post;
        })
      };
    case actions.UPDATE_NEXT_OFFSET:
      return {
        ...postState,
        nextOffset: action.payload.offset
      };
    case actions.UPDATE_POST:
      const posts = postState.posts.filter(
        p => p.uuid !== action.payload.post.uuid
      );
      return {
        ...postState,
        posts: [...posts, action.payload.post]
      };
    case actions.UPDATE_POSTS:
      return {
        ...postState,
        posts: action.payload.posts
      };
    default:
      return postState;
  }
};

/**
 * Adds a comment to the post's state.
 * @param postState The current post state.
 * @param postUUID The uuid of the post.
 * @param comment The comment being created for the post.
 */
const addComment = (
  postState: IPost[],
  postUUID: string,
  comment: IComment
): IPost[] => {
  const post = postState.find(p => p.uuid === postUUID);
  if (post) {
    post.comments.push(comment);
  }
  return postState;
};

/**
 * Deletes a comment from the post's state.
 * @param postState The current post state.
 * @param commentUUID The uuid of the comment.
 * @param postUUID The uuid of the post.
 */
const deleteComment = (
  postState: IPost[],
  commentUUID: string,
  postUUID: string
): IPost[] => {
  const post = postState.find(p => p.uuid === postUUID);
  if (post) {
    post.comments = post.comments.filter(c => c.uuid !== commentUUID);
  }
  return postState;
};
