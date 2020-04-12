import React from 'react';

interface IBasicListProps {
  items?: any[];
  renderCallback: (item: any) => JSX.Element;
}

/**
 * A component that displays a list of posts.
 * @param items A list of items to render.
 * @param renderCallback Dictates how the item should be rendered.
 */
const BasicList = ({ items, renderCallback }: IBasicListProps): JSX.Element => {
  return (
    <div>
      {items && items.length ? items.map((item) => renderCallback(item)) : []}
    </div>
  );
};

export default BasicList;
