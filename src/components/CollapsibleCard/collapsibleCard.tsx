import React, { useState } from 'react';
import './styles/styles.css';

interface ICollapsibleCardProps {
  title: string;
  children: any;
}

/**
 * A component that hides another component.
 * @param title The title of the collapsible area that when clicked, changes the state.
 * @param children The child component inside the collapsible area.
 */
const CollapsibleCard = ({
  title,
  children
}: ICollapsibleCardProps): JSX.Element => {
  const [isCollapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => setCollapsed(!isCollapsed);

  return (
    <div className='collapsible-card'>
      <div className='collapsible-card-title'>
        <button className='collapsible-card-link' onClick={toggleCollapsed}>
          {title}
        </button>
      </div>
      <div
        className={
          isCollapsed
            ? 'collapsible-card-body-disable'
            : 'collapsible-card-body'
        }
      >
        <div>{children}</div>
      </div>
    </div>
  );
};

export default CollapsibleCard;
