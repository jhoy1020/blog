import React, { createContext, Dispatch, useContext, useReducer } from 'react';
import { useAsyncEffect } from 'use-async-effect';
import blogApi from '../../services/api';
import UserAuthManager from '../../services/userAuth/userAuthManager';
import * as actions from './actions';

interface IUserProviderProps {
  children: React.ReactNode;
  initialState: IUserState;
  reducers: any;
}

const UserDispatchContext = createContext<Dispatch<IAction> | undefined>(
  undefined
);

const UserContext = createContext<IUserState | undefined>(undefined);

const UserProvider = ({
  children,
  initialState,
  reducers,
}: IUserProviderProps) => {
  const [state, dispatch] = useReducer(reducers, initialState);
  useAsyncEffect(
    async () => {
      if (!UserAuthManager.instance.isAuthenticated()) {
        return;
      }
      const userInfo = await blogApi.getMe();
      if (userInfo) {
        dispatch(
          actions.setUserInfo(
            UserAuthManager.instance.isAuthenticated(),
            userInfo
          )
        );
      }
    },
    () => {
      /* Nothing to do here. */
    },
    []
  );

  return (
    <UserContext.Provider value={state as IUserState}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
};

const gitHubLogin = async (
  dispatch: Dispatch<IAction>,
  token: string
): Promise<void> => {
  const response = await blogApi.loginWithGitHubOauth(token);
  UserAuthManager.instance.setAuthToken(response.token);
  dispatch(
    actions.setUserInfo(
      UserAuthManager.instance.isAuthenticated(),
      response.user
    )
  );
};

const login = async (
  dispatch: Dispatch<IAction>,
  password: string,
  username: string
): Promise<void> => {
  const response = await blogApi.login(password, username);
  UserAuthManager.instance.setAuthToken(response.token);
  dispatch(
    actions.setUserInfo(
      UserAuthManager.instance.isAuthenticated(),
      response.user
    )
  );
};

const logout = (dispatch: Dispatch<IAction>): void => {
  UserAuthManager.instance.logOut();
  dispatch(actions.setUserInfo(false, undefined));
};

const useUserState = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('');
  }
  return context;
};

const useUserDispatch = () => {
  const context = useContext(UserDispatchContext);
  if (!context) {
    throw new Error('');
  }
  return context;
};

export {
  UserProvider,
  gitHubLogin,
  login,
  logout,
  useUserDispatch,
  useUserState,
};
