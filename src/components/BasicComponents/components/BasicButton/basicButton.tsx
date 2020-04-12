import React from 'react';

interface IBasicButtonProps {
  className: string;
  disabled: boolean;
  label: string;
  onClick: () => void;
}

/**
 *
 * @param className
 * @param disabled
 * @param label
 * @param onClick
 */
const BasicButton = ({
  className,
  disabled,
  label,
  onClick
}: IBasicButtonProps): JSX.Element => {
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default BasicButton;
