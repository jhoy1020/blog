interface IPostResponse {
  // currentOffset: number;
  nextOffset: number;
  posts: IPost[];
}

interface IUserResponse {
  nextOffset: number;
  users: IUser[];
}
