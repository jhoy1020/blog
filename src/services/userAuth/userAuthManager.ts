/**
 * Need to use a require statement here instead of import
 * because decoded.exp is not visible otherwises.
 */
const decode = require('jwt-decode');

export default class UserAuthManager implements UserAuthManager {
  public static get instance(): UserAuthManager {
    if (!this.userAuthManager) {
      this.userAuthManager = new UserAuthManager();
    }
    return this.userAuthManager;
  }

  private static userAuthManager: UserAuthManager;

  private static readonly TOKEN_KEY = 'jhoy_id_token';

  public getAuthToken(): string {
    const token = localStorage.getItem(UserAuthManager.TOKEN_KEY);
    return !token ? '' : token;
  }

  public isAuthenticated(): boolean {
    const token = this.getAuthToken();
    if (!!token && !this.isTokenExpired(token)) {
      return true;
    }
    this.logOut();
    return false;
  }

  public isTokenExpired(token: string): boolean {
    try {
      const decoded = decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      return false;
    }
  }

  public logOut(): void {
    localStorage.removeItem(UserAuthManager.TOKEN_KEY);
  }

  public setAuthToken(token: any): void {
    localStorage.setItem(UserAuthManager.TOKEN_KEY, token);
  }
}
