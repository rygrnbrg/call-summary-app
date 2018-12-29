import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth';
import { AuthenticationData } from '../../models/authentication';
import { Observable } from 'rxjs';

export interface UserData {
  id: string;
  email: string;
}

@Injectable()
export class User {
  private _user: firebase.User;

  constructor(private authProvider: AuthProvider) {
    authProvider.afAuth.authState.subscribe((res) => {
      this._user = res;
    });
  }

  public login(data: AuthenticationData): Promise<any> {
    return this.authProvider.doLogin(data).then(
      res => {
        this._loggedIn(res);
      },
      err => {
        return Promise.reject(err);
      }
    );
  }

  public loginExistingUser(user: firebase.User): void {
    if (user) {
      this._user = user;
      console.log('Logged in existing user');
    }

  }

  public signup(data: AuthenticationData) {
    return this.authProvider.doRegister(data);
  }

  public resetPassword(email: string) {
    return this.authProvider.doSendPasswordResetEmail(email);
  }

  public sendVerificationEmail() {
    return this.authProvider.doSendVerificationEmail();
  }

  public getUserData(): UserData {
    return {
      id: this._user.uid,
      email: this._user.email
    };
  }

  public authenticationState(): Observable<firebase.User | null> {
    return this.authProvider.afAuth.authState;
  }

  public logout() {
    this._user = null;
  }

  private _loggedIn(user: firebase.User) {
    this._user = user;
  }

}
