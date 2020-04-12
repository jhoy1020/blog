import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { BasicInput } from '../../../../components';
import { history } from '../../../../services/history/history';
import {
  login,
  useUserDispatch,
  useUserState,
} from '../../../../state/users/userProvider';
import './styles/styles.css';

interface ILoginInputs {
  password: string;
  username: string;
}

/**
 * The default values for the form.
 */
const defaultInputs: ILoginInputs = {
  password: '',
  username: '',
};

/**
 * The login page.
 */
const LoginPage = (): JSX.Element => {
  const [allFieldsValid, setAllFieldsValid] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);
  const [inputs, setInputs] = useState(defaultInputs);
  const [isDisabled, setDisabled] = useState(true);

  const userDispatch = useUserDispatch();
  const userState = useUserState();

  const captchaSiteKey = process.env.REACT_APP_CAPTCHA_SITE_KEY as string;

  /**
   * Updates the specified inputs as the user enters in data.
   * @param e The input onchange event info.
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    e.persist();
    setInputs({ ...inputs, [e.target.name]: e.target.value });
    setAllFieldsValid(inputs.username !== '' && inputs.password !== '');
  };

  /**
   * Alters the captcha state when it is clicked.
   */
  const updateCaptchaState = (): void => {
    setDisabled(!isDisabled);
  };

  /**
   * Is called when the user requests to be authenticated.  Will redirect
   * to the dashboard on successful attempts.
   * @param e The form event info.
   */
  const authenticateUser = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      await login(userDispatch, inputs.password, inputs.username);
      history.push('/dashboard');
    } catch (error) {
      setLoginFailed(true);
    } finally {
      setAllFieldsValid(false);
    }
  };

  /**
   * If already logged in, redirect to the dashboard.
   */
  useEffect(() => {
    if (userState.isAuthenticated) {
      history.push('/dashboard');
    }
  }, [userState.isAuthenticated]);

  return (
    <div className='login-container'>
      <form onSubmit={authenticateUser}>
        <div className='login-header'>
          <h1>Please Login</h1>
        </div>
        <BasicInput
          className='login-input'
          labelName='username'
          inputValue={inputs.username}
          type='text'
          onChange={handleInputChange}
        />
        <BasicInput
          className='login-input'
          labelName='password'
          inputValue={inputs.password}
          type='password'
          onChange={handleInputChange}
        />
        <div className='login-captcha'>
          <ReCAPTCHA sitekey={captchaSiteKey} onChange={updateCaptchaState} />
        </div>
        {loginFailed ? <p className='pt-3'>Login incorrect.</p> : null}
        <div className='login-button'>
          <button
            type='submit'
            className='shared-button'
            disabled={!allFieldsValid || isDisabled}
          >
            Login
          </button>
        </div>
      </form>
      <p className='login-footer'>© 2017-2019</p>
    </div>
  );
};

export default LoginPage;
