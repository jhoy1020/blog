import * as actions from './actions';

/**
 * The post reducer that is called when a post action is called.
 * @param state The current state.
 * @param action The action to take.
 */
export const UserReducer = (
  userState: IUserState,
  action: IAction
): IUserState => {
  switch (action.type) {
    case actions.SET_USER_INFO:
      return {
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user
      };
    default:
      return userState;
  }
};
