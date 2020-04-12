/**
 * List of all user actions.
 */
export const SET_USER_INFO = 'SET_USER_INFO';

/**
 * Creates an action that creates an object that updates the
 * user's information in global state.
 * @param user The updated user's information.
 */
export const setUserInfo = (
  isAuthenticated: boolean,
  user?: IUser
): IAction => ({
  payload: {
    isAuthenticated,
    user
  },
  type: SET_USER_INFO
});
