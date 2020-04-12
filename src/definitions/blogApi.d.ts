interface IBlogApi {
  /**
   * Sends a request to the api to add a comment for the specified post.
   * @param commentUUID
   * @param createdAt
   * @param postUUID  The post id that the comment is associated with.
   * @param text The comment that the user left.
   */
  createComment(
    commentUUID: string,
    createdAt: Date,
    postUUID: string,
    text: string
  ): Promise<IComment>;

  /**
   * Sends a request to the api to create a new blog post.
   * @param createdAt When the post was created.
   * @param imageUrl The image for the post.
   * @param isPublished Indicates if the post should should be displayed.
   * @param postUUID The uuid for the post.
   * @param text The actual post's post.
   * @param title The post's title.
   */
  createPost(
    createdAt: Date,
    imageUrl: string,
    isPublished: boolean,
    postUUID: string,
    text: string,
    title: string
  ): Promise<IPost>;

  /**
   * Deletes a specific comment for the specific post.
   * @param commentId The id of the comment to delete.
   * @param postUUID The post uuid.
   */
  deleteComment(commentUUID: string, postUUID: string): Promise<void>;

  /**
   * Deletes a specific post.
   * @param postUUID The uuid of the post to delete.
   */
  deletePost(postUUID: string): Promise<void>;

  /**
   * Deletes a user from the database.
   * @param userUUID The uuid of the user to delete.
   */
  deleteVisitor(userUUID: string): Promise<void>;

  /**
   * Updates the specified post with the given updates.
   * @param imageUrl The image for the post.
   * @param isPublished Indicates if the post should should be displayed.
   * @param postUUID The post uuid to update.
   * @param text The updated post.
   * @param title The updated title.
   */
  editPost(
    imageUrl: string,
    isPublished: boolean,
    postUUID: string,
    text: string,
    title: string
  ): Promise<IPost>;

  /**
   * Gets all the comments for the given post.
   * @param postUUID The postId to get comments for.
   */
  getComments(postUUID: string): Promise<IComment[]>;

  /**
   * Gets the logged in users data.
   */
  getMe(): Promise<IUser>;

  /**
   * Gets a specific post for the given post uuid.
   * @param postUUID The uuid for the post to get.
   */
  getPost(postUUID: string): Promise<IPost>;

  /**
   * Gets the specific post for the given post uuid and all it's comments.
   * @param postUUID The uuid for the post to get.
   */
  getPostWithComments(postUUID: string): Promise<IPost>;

  /**
   * Gets the specified limit of posts at the given offset.
   * @param limit The max number of posts to fetch.
   * @param offset The post's offset to fetch.
   * @returns A list of all the posts in the db.
   */
  getPosts(limit: number, offset: number): Promise<IPostResponse>;

  /**
   * Gets the specified limit of posts at the given offset.
   * @param limit The max number of users to fetch.
   * @param offset The user's offset to fetch.
   * @returns A list of all the users in the db.
   */
  getVisitors(limit: number, offset: number): Promise<IUserResponse>;

  /**
   * Sends a login request to the api and returns the auth token.
   * @param password The user's password.
   * @param username The user's name.
   */
  login(password: string, username: string): Promise<any>;

  /**
   * Calls the Git authorization endpoint to get an access_token.
   * @param code The code sent back from Git to be exchanged to get an
   * access_token.
   */
  loginWithGitHubOauth(token: string): Promise<any>;

  /**
   * Calls the api with the users info and message, to send an email
   * to me.
   * @param email  The user's email.
   * @param message The message they want to send.
   * @param name The user's name.
   */
  sendEmail(email: string, message: string, name: string): Promise<void>;

  /**
   * Uploads the image to aws.
   * @param image The image file to update.
   * @returns The aws url to the image.
   */
  uploadImage(image: File): Promise<string>;
}
