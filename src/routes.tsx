import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import BlogRoutes from './apps/Blog/blogRoutes';
import DashboardRoutes from './apps/Dashboard/dashboardRoutes';
import LoginPage from './apps/Dashboard/scenes/Login';
import { history } from './services/history/history';
import { UserReducer } from './state/users/reducers';
import { UserProvider } from './state/users/userProvider';
import './styles/styles.css';

// The initial state for the application.
const initialUserState: IUserState = {
  isAuthenticated: false,
  user: {
    avatarUrl: '',
    role: '',
    username: '',
    uuid: ''
  }
};

export const Routes = () => {
  return (
    <UserProvider initialState={initialUserState} reducers={UserReducer}>
      <Router history={history}>
        <Switch>
          <Route path='/dashboard' component={DashboardRoutes} />
          <Route path='/login' component={LoginPage} />
          <Route path='/' component={BlogRoutes} />
        </Switch>
      </Router>
    </UserProvider>
  );
};
