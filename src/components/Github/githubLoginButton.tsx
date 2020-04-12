import React from 'react';
import PopupWindow from '../PopupWindow/PopupWindow';
import './styles/styles.css';

interface IGithubLoginButtonProps {
  buttonText: string;
  githubClientId: string;
  githubScope: string;
  redirectUrl: string;
  onSuccessCallback: (data: any) => void;
  onFailureCallback: (error: any) => void;
}

/**
 * A button that allows a user to login via github.
 * @param buttonText The text to display.
 * @param githubClientId The client id created in github's oauth page.
 * @param githubScope The user's information that we are trying to retrieve.
 * @param onSuccessCallback The callback function that executes on a successful login.
 * @param onFailureCallback The callback function that executes on a failed login.
 */
const GithubLoginButton = ({
  buttonText,
  githubClientId,
  githubScope,
  redirectUrl,
  onSuccessCallback,
  onFailureCallback
}: IGithubLoginButtonProps): JSX.Element => {
  const gitUrl = 'https://github.com/login/oauth/authorize?';

  const onClick = (): void => {
    // Construct the github login url.
    const url = `${gitUrl}client_id=${githubClientId}&scope=${githubScope}&redirect_uri=${redirectUrl}`;

    // Opens a new window and navigates to github's login page.
    PopupWindow.open(
      'gitlogin',
      url,
      'width=500,height=800',
      onFailure,
      onSuccess
    );
  };

  /**
   * Called when login fails.
   * @param error Called when user fails to login.
   */
  const onFailure = (error: any): void => {
    onFailureCallback(error);
  };

  /**
   * Called when login is successful.
   * @param data The data passed in when the user logs in.
   */
  const onSuccess = (data: any): void => {
    // Github sends back a string ?token=#####.  Therefore,
    // we need to parse the token out of the string.
    const token: string = data.replace('?', '').split('=')[1];
    onSuccessCallback(token);
  };

  return (
    <div>
      <button className='github-button-link' onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
};

export default GithubLoginButton;
