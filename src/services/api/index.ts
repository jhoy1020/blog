import axios, { AxiosInstance } from 'axios';
import UserAuthManager from '../userAuth/userAuthManager';

export class BlogApi implements IBlogApi {
  private readonly api: AxiosInstance;

  constructor(url: string, private readonly userAuthManager: UserAuthManager) {
    this.api = axios.create({
      baseURL: url,
    });
  }

  public async createComment(
    commentUUID: string,
    createdAt: Date,
    postUUID: string,
    text: string
  ): Promise<IComment> {
    const response = await this.api.post(
      `/posts/${postUUID}/comments`,
      {
        commentUUID,
        createdAt,
        postUUID,
        text,
      },
      this.getAuthConfig()
    );
    return response.data;
  }

  public async createPost(
    createdAt: Date,
    imageUrl: string,
    isPublished: boolean,
    postUUID: string,
    text: string,
    title: string
  ): Promise<IPost> {
    const response = await this.api.post(
      '/posts',
      {
        createdAt,
        imageUrl,
        isPublished,
        postUUID,
        text,
        title,
      },
      this.getAuthConfig()
    );
    return response.data;
  }

  public async deleteComment(
    commentUUID: string,
    postUUID: string
  ): Promise<void> {
    await this.api.delete(
      `/posts/${postUUID}/comments/${commentUUID}`,
      this.getAuthConfig()
    );
  }

  public async deletePost(postUUID: string): Promise<void> {
    await this.api.delete(`/posts/${postUUID}`, this.getAuthConfig());
  }

  public async deleteVisitor(userUUID: string): Promise<void> {
    await this.api.delete(`/visitors/${userUUID}`, this.getAuthConfig());
  }

  public async editPost(
    imageUrl: string,
    isPublished: boolean,
    postUUID: string,
    text: string,
    title: string
  ): Promise<IPost> {
    const response = await this.api.patch(
      `/posts/${postUUID}`,
      {
        imageUrl,
        isPublished,
        postUUID,
        text,
        title,
      },
      this.getAuthConfig()
    );
    return response.data;
  }

  public async getComments(postUUID: string): Promise<IComment[]> {
    const response = await this.api.get(`/posts/${postUUID}/comments`);
    return response.data;
  }

  public async getMe(): Promise<IUser> {
    const response = await this.api.get('/visitors/me', this.getAuthConfig());
    return response.data;
  }

  public async getPost(postUUID: string): Promise<IPost> {
    const response = await this.api.get(`/posts/${postUUID}`);
    return response.data;
  }

  public async getPostWithComments(postUUID: string): Promise<IPost> {
    const post = await this.getPost(postUUID);
    const comments = await this.getComments(postUUID);
    post.comments = comments || [];
    return post;
  }

  public async getPosts(limit: number, offset: number): Promise<IPostResponse> {
    const response = await this.api.get(
      `/posts?offset=${offset}&limit=${limit}`
    );
    return response.data;
  }

  public async getVisitors(
    offset: number,
    limit: number
  ): Promise<IUserResponse> {
    const response = await this.api.get(
      `/visitors?offset=${offset}&limit=${limit}`,
      this.getAuthConfig()
    );
    return response.data;
  }

  public async login(password: string, username: string): Promise<any> {
    const response = await this.api.post('/auth/login', {
      password,
      username,
    });
    return response.data;
  }

  public async loginWithGitHubOauth(token: string): Promise<any> {
    const response = await this.api.post('/oauth', { token });
    return response.data;
  }

  public async sendEmail(
    email: string,
    message: string,
    name: string
  ): Promise<void> {
    await this.api.post('/email', {
      email,
      message,
      name,
    });
  }

  public async uploadImage(image: File): Promise<string> {
    const imageData = new FormData();
    imageData.append('file', image);
    const response = await this.api.post(
      '/upload',
      imageData,
      this.getAuthConfig()
    );
    return response.data;
  }

  /**
   * Gets the authenticated token and creates the header to send in
   * the request.
   */
  private getAuthConfig(): any {
    return {
      headers: {
        Authorization: 'bearer ' + this.userAuthManager.getAuthToken(),
      },
    };
  }
}
const blogApiUrl = process.env.REACT_APP_API_URL as string;
const blogApi = new BlogApi(blogApiUrl, UserAuthManager.instance);
export default blogApi;
