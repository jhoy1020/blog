export type PopupCallback = (data: any) => void;

export default class PopupWindow {
  /**
   * Opens a popup window and returns that instance.
   * @param id The id of the popup window.
   * @param url The url to open within the popup window.
   * @param windowOptions The options i.e width and height of the window.
   * @param onFailure The callback if the popup closes with a failure.
   * @param onSuccess The callback if the popup closes successfully.
   */
  public static open(
    id: string,
    url: string,
    windowOptions: string,
    onFailure: PopupCallback,
    onSuccess: PopupCallback
  ): PopupWindow {
    const popupWindow = new PopupWindow(id, url, windowOptions);
    popupWindow.open();
    popupWindow.pollUntilRequestCompletes(onFailure, onSuccess);
    return popupWindow;
  }

  // Max time allowed for the request to run for.
  private readonly REQUEST_TIMEOUT = 500;

  private readonly id: string;
  private readonly url: string;

  private promise!: Promise<string>;
  private window!: Window;
  private windowId: number;
  private windowOptions: string;

  /**
   * Creates a new instance of the popup window.
   * @param id The id for the popup window.
   * @param url The url to open within the popup window.
   * @param windowOptions The options i.e width and height of the window.
   */
  private constructor(id: string, url: string, windowOptions: string) {
    this.id = id;
    this.url = url;
    this.windowId = 0;
    this.windowOptions = windowOptions;
  }

  /**
   * Closes the popup window.
   */
  private cancelAuthRequest(): void {
    if (this.windowId === 0) {
      return;
    }
    window.clearInterval(this.windowId);
    this.windowId = 0;
  }

  /**
   * Closes the popup window.
   */
  private close(): void {
    this.cancelAuthRequest();
    this.window.close();
  }

  /**
   * Opens a popup window.
   */
  private open(): void {
    const win = window.open(this.url, this.id, this.windowOptions);
    if (!win) {
      throw Error('Failed to open the url.');
    }
    this.window = win;
  }

  /**
   *  Waits until the popup window closes.
   * @param onFailure The callback that is called on a failure.
   * @param onSuccess The callback that is called on success.
   */
  private pollUntilRequestCompletes(
    onFailure: PopupCallback,
    onSuccess: PopupCallback
  ): void {
    this.promise = new Promise((resolve) => {
      this.windowId = window.setInterval(() => {
        try {
          if (!this.window || this.window.closed === true) {
            this.close();
            return;
          }
          if (
            this.window.location.href === this.url ||
            this.window.location.pathname === 'blank'
          ) {
            return;
          }
          resolve(this.window.location.search);
          this.close();
        } catch (error) {
          // Ignore DOMException: Blocked a frame with origin from accessing a
          // cross-origin frame.
        }
      }, this.REQUEST_TIMEOUT);
    });
    this.promise.then(
      (data) => onSuccess(data),
      (error) => onFailure(error)
    );
  }
}
