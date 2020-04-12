import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { CheckUserPermissions } from '../../../../components';
import * as userProvider from '../../../../state/users/userProvider';
import { DashboardPostCard, DashboardUserCard } from './components';

/**
 * The dashboard page.
 */
const DashboardPage = (): JSX.Element => {
  return (
    <div>
      <Link to='/dashboard/posts'>
        <button className='shared-button'>New Post</button>
      </Link>
      <div style={{ marginTop: 20 }}>
        <DashboardPostCard />
        <br />
        <DashboardUserCard />
      </div>
    </div>
  );
};

const AuthDashboardPage = (): JSX.Element => {
  const userState = userProvider.useUserState();
  const userRole =
    userState && userState.user ? userState.user.role : 'visitor';
  return (
    <CheckUserPermissions
      role={userRole}
      action={'dashboard-page:visit'}
      data={null}
      renderComponent={<DashboardPage />}
      redirectComponent={<Redirect to='/' />}
    />
  );
};

export default AuthDashboardPage;
