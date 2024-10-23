import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {LocalStorageService} from "./local-storage.service";

@Injectable({
  providedIn: 'root'
})

/**
 * This service is used to keep the things related to Auth,
 * so user info, token and things like that can be kept here
 */
export class SessionService {

  public isLoggedIn = false;
  // public auth = new BehaviorSubject<boolean>(null);
  public auth = new ReplaySubject(1);
  private token: string;
  private user: any;

  constructor(private storage: LocalStorageService) {
    // Get all info from localstorage
    this.init().then(() => {
      console.log('Session service is read!');
    }).catch((e) => {
      console.log('Unable to init session service', e);
    });
  }

  /**
   * To be used to set token.
   * @param token - The token post received post login.
   */
  async setToken(token: string) {
    this.token = token;
    await this.storage.setItem('token', token);
    await this.storage.setBoolean('loggedIn', true);
  }

  /**
   * To be used to set user.
   * @param user - The user object.
   */
  async setUser(user: any) {
    this.user = user;
    this.isLoggedIn = true;
    this.auth.next(true);
    await this.storage.setObject('user', user);
  }

  /** This function can be used to get token */
  getToken() {
    return this.token;
  }

  /** This function can be used to get user */
  getUser() {
    return this.user;
  }

  /** Logout current user */
  async logout() {
    this.isLoggedIn = false;
    await this.storage.removeItem('user');
    await this.storage.removeItem('token');
    await this.storage.setBoolean('loggedIn', false);
    this.token = '';
    this.auth.next(false);
  }

  /** This function is private and should not be used for anything else than init of session service */
  private async init() {
    this.isLoggedIn = await this.storage.getBoolean('loggedIn');
    this.user = await this.storage.getObject('user');
    this.token = await this.storage.getItem('token');
    console.log('Auth loaded is ', this.isLoggedIn);

    // Dummy allowed access intentionally remove this block
    // this.isLoggedIn = true;
    // Remove this block if prod
    console.log('Auth is ', this.isLoggedIn);
    this.auth.next(this.isLoggedIn);
    // We can also optionally call refresh token API is available to refresh the token
  }
}
