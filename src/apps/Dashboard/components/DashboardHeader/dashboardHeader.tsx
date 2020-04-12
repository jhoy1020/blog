import React from 'react';
import { Link } from 'react-router-dom';
import { BasicButton } from '../../../../components/BasicComponents';
import { history } from '../../../../services/history/history';
import { logout, useUserDispatch } from '../../../../state/users/userProvider';
import './styles/styles.css';

/**
 * The header for the dashboard page.
 */
const DashboardHeader = (): JSX.Element => {
  const userDipatch = useUserDispatch();

  /**
   * Logs the user out and redirects to the home page.
   */
  const signOut = (): void => {
    logout(userDipatch);
    history.push('/');
  };

  return (
    <div>
      <div className='dashboard-header-top'>
        <BasicButton
          className='shared-button-link'
          disabled={false}
          label='Logout'
          onClick={signOut}
        />
      </div>
      <div className='dashboard-header-bar'>
        <Link to='/dashboard' className='dashboard-header-link'>
          <h4>Dashboard</h4>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
