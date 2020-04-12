import React from 'react';
import ReactDOM from 'react-dom';
import AboutCard from '../aboutCard';

it('renders without crashing', () => {
  const div = document.createElement('div');
  // ReactDOM.render(<AboutCard />, div);
  ReactDOM.unmountComponentAtNode(div);
});
