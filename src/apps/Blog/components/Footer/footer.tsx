import React from 'react';
import Icon from 'react-icons-kit';
import { githubSquare } from 'react-icons-kit/fa/githubSquare';
import { linkedinSquare } from 'react-icons-kit/fa/linkedinSquare';
import { NavLink } from 'react-router-dom';
import './styles/styles.css';

/**
 * Displayed on the bottom of a page.
 */
const Footer = (): JSX.Element => (
  <footer className='footer-container'>
    <div className='footer-body'>
      <NavLink exact={true} to='/privacy'>
        <div className='footer-link'>Privacy Policy</div>
      </NavLink>
      <div className='footer-social'>
        <a href='https://github.com/jhoy1020' style={{ color: '#24292E' }}>
          <Icon icon={githubSquare} size={40} />
        </a>
        <a
          href='https://www.linkedin.com/in/josh-hoy-090005a'
          style={{ color: '#0077B5' }}
        >
          <Icon icon={linkedinSquare} size={40} />
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
