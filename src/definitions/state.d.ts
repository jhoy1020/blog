interface IAction {
  payload: any;
  type: string;
}

interface IPostState {
  // currentOffset: number;
  nextOffset: number;
  posts: IPost[];
}

interface IUserState {
  isAuthenticated: boolean;
  user?: IUser;
}

interface IState {
  posts: IPost[];
  user?: IUser;
}
