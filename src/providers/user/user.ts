import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { AuthProvider } from '../auth/auth';
import { AuthenticationData } from '../../models/authentication';

export interface UserData{
  id: string;
  email: string;
}

@Injectable()
export class User {
  _user: firebase.auth.UserCredential;

  constructor(public authProvider: AuthProvider) { }

  login(data: AuthenticationData) : Promise<any>  {
    return this.authProvider.doLogin(data).then(
       res => {
          this._loggedIn(res);
       },
       err => {
          return Promise.reject(err);
       }
    );
  }

  signup(data: AuthenticationData) {
    return this.authProvider.doRegister(data);
  }

  resetPassword(email: string){
    return this.authProvider.doSendPasswordResetEmail(email);
  }

  sendVerificationEmail(){
    return this.authProvider.doSendVerificationEmail();
  }

  getUserData(): UserData{
    return {
      id: this._user.user.uid,
      email: this._user.user.email,
    };
  }

  logout() {
    this._user = null;
  }

  _loggedIn(user: firebase.auth.UserCredential) {
    this._user = user;
  }
}
