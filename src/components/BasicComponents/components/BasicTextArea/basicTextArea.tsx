import React, { ChangeEvent } from 'react';
import '../styles/styles.css';

interface IBasicTextAreaProps {
  className: string;
  labelName: string;
  inputValue?: string;
  textAreaSize: number;
  onChange(e: ChangeEvent<HTMLTextAreaElement>): void;
}

/**
 * A input control that has a label name, an optional input value, and an on change
 * callback.  The callback will be called whenever the input value changes.
 * @param labelName The label name of the input.
 * @param inputValue The initial value of the input.
 * @param onChange Is called whenever the input changes.
 * @param textAreaSize The size of the text area.
 */
const BasicTextArea = ({
  className,
  labelName,
  inputValue,
  onChange,
  textAreaSize
}: IBasicTextAreaProps): JSX.Element => {
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
      <textarea
        name={labelName}
        className={className}
        aria-label='With textarea'
        placeholder={labelName}
        value={inputValue || ''}
        rows={textAreaSize}
        onChange={onChange}
        required={true}
      />
    </div>
  );
};

export default BasicTextArea;
