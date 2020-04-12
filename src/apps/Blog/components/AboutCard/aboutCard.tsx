import React from 'react';
import { Link } from 'react-router-dom';
import './styles/styles.css';

/**
 * A card to use to display a snippet of information.
 */
const AboutCard = (): JSX.Element => (
  <div className='about-card-container'>
    <div className='about-card-body'>
      <h2 className='about-card-title'>About Me</h2>
      <p className='about-card-details'>
        Hello and welcome to my site. My name is Josh Hoy, a software engineer
        that loves writing code. To find out more about me check out the{' '}
        <Link to='/about'>about page</Link>.
      </p>
    </div>
  </div>
);

export default AboutCard;
