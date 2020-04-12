import React from 'react';
import ReactQuill from 'react-quill';
import '../styles/styles.css';

interface IBasicRichTextboxProps {
  height: number;
  inputValue?: string;
  labelName: string;
  onChange(value: string): void;
}

/**
 * A input control that has a label name, an optional input value, and an on change
 * callback.  The callback will be called whenever the input value changes.
 * @param labelName The label name of the input.
 * @param inputValue The initial value of the input.
 * @param onChange Is called whenever the input changes.
 */
const BasicRichTextbox = ({
  height,
  inputValue,
  labelName,
  onChange
}: IBasicRichTextboxProps): JSX.Element => {
  return (
    <div>
      {labelName === '' ? null : (
        <div className='basic-label'>
          <label>{labelName}</label>
          <label hidden={inputValue !== ''} className='basic-label-alert'>
            *
          </label>
        </div>
      )}
      <ReactQuill
        className='basic-rich-text-area'
        style={{ height }}
        value={inputValue || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default BasicRichTextbox;
