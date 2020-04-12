import React, { ChangeEvent } from 'react';
import '../styles/styles.css';

interface IBasicInputProps {
  className: string;
  labelName: string;
  inputValue?: string;
  type: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
}

/**
 * A input control that has a label name, an optional input value, and an on change
 * callback.  The callback will be called whenever the input value changes.
 * @param className The style for the input field.
 * @param labelName The label name of the input.
 * @param inputValue The initial value of the input.
 * @param type The type of input. i.e text etc...
 * @param onChange Is called whenever the input changes.
 */
const BasicInput = ({
  className,
  labelName,
  inputValue,
  type,
  onChange
}: IBasicInputProps): JSX.Element => {
  return (
    <div>
      {labelName === '' ? null : (
        <div>
          <label className='basic-label'>{labelName}</label>
          <label hidden={inputValue !== ''} className='basic-label-alert'>
            *
          </label>
        </div>
      )}
      <input
        type={type}
        className={className}
        placeholder={labelName}
        value={inputValue || ''}
        name={labelName}
        id={labelName}
        onChange={onChange}
        required={true}
      />
    </div>
  );
};

export default BasicInput;
