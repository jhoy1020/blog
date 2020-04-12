/*
 * List of all post actions.
 */
export const ADD_COMMENT = 'ADD_COMMENT';
export const ADD_POST = 'ADD_POST';
export const DELETE_COMMENT = 'DELETE_COMMENT';
export const DELETE_POST = 'DELETE_POST';
export const UPDATE_COMMENTS = 'UPDATE_COMMENTS';
// export const UPDATE_CURRENT_OFFSET = 'UPDATE_CURRENT_OFFSET';
export const UPDATE_NEXT_OFFSET = 'UPDATE_OFFSET';
export const UPDATE_POST = 'UPDATE_POST';
export const UPDATE_POSTS = 'UPDATE_POSTS';

/**
 * Creates an add comment action that adds a comment to state.
 * @param postUUID The post the comment is being added for.
 * @param comment The comment being added.
 */
export const addComment = (postUUID: string, comment: IComment): IAction => ({
  payload: {
    comment,
    postUUID
  },
  type: ADD_COMMENT
});

/**
 *
 * @param post
 */
export const addPost = (post: IPost): IAction => ({
  payload: {
    post
  },
  type: ADD_POST
});

/**
 * Creates a delete comment action that deletes a comment from state.
 * @param commentUUID The uuid of the comment.
 * @param postUUID The uuid of the post the comment belongs too.
 */
export const deleteComment = (
  commentUUID: string,
  postUUID: string
): IAction => ({
  payload: {
    commentUUID,
    postUUID
  },
  type: DELETE_COMMENT
});

/**
 * Creates a delete post action that deletes a post from state.
 * @param postUUID The uuid of the post.
 */
export const deletePost = (postUUID: string): IAction => ({
  payload: {
    postUUID
  },
  type: DELETE_POST
});

/**
 * Creates an action that creates an object that updates the comments
 * in global state.
 * @param postUUID The postId that the comments are for.
 * @param comments The comments to update for the given post id.
 */
export const updateComments = (
  postUUID: string,
  comments: IComment[]
): IAction => ({
  payload: {
    comments,
    postUUID
  },
  type: UPDATE_COMMENTS
});

/* export const updateCurrentOffset = (offset: number): IAction => ({
  payload: {
    offset
  },
  type: UPDATE_CURRENT_OFFSET
});*/

/**
 *
 * @param offset
 */
export const updateNextOffset = (offset: number): IAction => ({
  payload: {
    offset
  },
  type: UPDATE_NEXT_OFFSET
});

/**
 * The post to be updated.
 * @param post The updated post.
 */
export const updatePost = (post: IPost): IAction => ({
  payload: {
    post
  },
  type: UPDATE_POST
});

/**
 * Creates an action that creates an object that updates the posts
 * in global state.
 * @param posts The posts to set in global state.
 */
export const updatePosts = (posts: IPost[]): IAction => ({
  payload: {
    posts
  },
  type: UPDATE_POSTS
});
