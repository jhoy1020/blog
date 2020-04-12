import React from 'react';
import { NavLink } from 'react-router-dom';
import { BasicButton } from '../../../../components';
import {
  logout,
  useUserDispatch,
  useUserState,
} from '../../../../state/users/userProvider';
import './styles/styles.css';

/**
 * The navigation header links the different pages.
 */
const Navigation = (): JSX.Element => {
  const userDipatch = useUserDispatch();
  const userState = useUserState();

  /**
   * Calls the logout method to sign the user out.
   */
  const signOut = async (): Promise<void> => {
    logout(userDipatch);
  };

  return (
    <header>
      <nav className='navbar-container'>
        <div className='navbar-icon'>h++</div>
        <div className='navbar-navigation'>
          <ul className='navbar-links'>
            <NavLink exact={true} to='/'>
              <div className='navbar-link'>Home</div>
            </NavLink>
            <NavLink exact={true} to='/about'>
              <div className='navbar-link'>About</div>
            </NavLink>
            <NavLink exact={true} to='/contact'>
              <div className='navbar-link'>Contact</div>
            </NavLink>
          </ul>
          <span className='navbar-signout'>
            {userState.isAuthenticated ? (
              <BasicButton
                className='navbar-signout-link'
                disabled={false}
                label='Sign Out'
                onClick={signOut}
              />
            ) : (
              <div />
            )}
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
