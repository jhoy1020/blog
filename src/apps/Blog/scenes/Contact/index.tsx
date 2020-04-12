import React, { ChangeEvent, MouseEvent, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { BasicInput, BasicTextArea } from '../../../../components';
import blogApi from '../../../../services/api';
import './styles/styles.css';

export interface IContactInputs {
  email: string;
  message: string;
  name: string;
}

/**
 * Default values for the form's inputs.
 */
const defaultContactInfo: IContactInputs = {
  email: '',
  message: '',
  name: '',
};

const ContactPage = (): JSX.Element => {
  const [allValidFields, setAllValidFields] = useState(false);
  const [contactInfo, setInputs] = useState(defaultContactInfo);
  const [isCaptchaEnabled, setIsCaptchaEnabled] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const siteKey = process.env.REACT_APP_CAPTCHA_SITE_KEY as string;

  // Email validation regex.
  const emailValidationRegx = /@/;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.persist();
    setInputsAndValidate(e.target.name, e.target.value);
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    e.persist();
    setInputsAndValidate(e.target.name, e.target.value);
  };

  const resetForm = () => {
    setInputs(defaultContactInfo);
    setIsValidEmail(true);
    setAllValidFields(false);
  };

  /**
   * Sets the input name and values in local state.
   * @param inputName The name of the property being updated.
   * @param inputValue The value of the property.
   */
  const setInputsAndValidate = (
    inputName: string,
    inputValue: string
  ): void => {
    const localContactInfo = { ...contactInfo, [inputName]: inputValue };

    let validEmail = true;
    if (inputName === 'email') {
      validEmail = emailValidationRegx.test(inputValue);
      setIsValidEmail(validEmail);
    }

    setAllValidFields(
      localContactInfo.name !== '' &&
        validEmail &&
        isValidEmail &&
        localContactInfo.message !== ''
    );
    setInputs(localContactInfo);
  };

  /**
   * Alters the captcha state when it is clicked.
   */
  const updateCaptchaState = (): void => setIsCaptchaEnabled(true);

  /**
   * Handles the submit when the submit button is clicked.
   * @param e The event when the button is clicked.
   */
  const handleSubmit = async (
    e: MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();
    let message = 'Thank you, your message was sent.';
    try {
      await blogApi.sendEmail(
        contactInfo.email,
        contactInfo.message,
        contactInfo.name
      );
    } catch (error) {
      message = 'Sorry :(, your message failed to be sent.';
    }
    alert(message);
    resetForm();
  };

  return (
    <div className='blog-container'>
      <div className='contact-container'>
        <BasicInput
          className='contact-input'
          labelName='name'
          inputValue={contactInfo.name}
          type='text'
          onChange={handleInputChange}
        />
        <div className={isValidEmail ? 'invalid-data-hidden' : 'invalid-data'}>
          Enter a valid email address.
        </div>
        <BasicInput
          className='contact-input'
          labelName='email'
          inputValue={contactInfo.email}
          type='text'
          onChange={handleInputChange}
        />
        <br />
        <BasicTextArea
          className='contact-input'
          labelName='message'
          inputValue={contactInfo.message}
          onChange={handleTextAreaChange}
          textAreaSize={10}
        />
        <br />
        <ReCAPTCHA sitekey={siteKey} onChange={updateCaptchaState} />
        <br />
        <button
          className='shared-button'
          disabled={!isCaptchaEnabled || !allValidFields}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ContactPage;
