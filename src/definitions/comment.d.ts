interface IComment {
  createdAt: Date;
  text: string;
  uuid: string;
  visitor?: IUser;
}
