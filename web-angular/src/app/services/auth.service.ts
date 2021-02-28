import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  login(data) {
    return  $.ajax({
      type: 'POST',
        url: environment.api_url + '/usuario/login',
        dataType: 'json',
        data: data,
        async: true,
    })
      .done((data) => {
        //console.log(data);
        this.setSession(data);

      })
      .fail((error) => {

      });

    
  }

  private setSession(authResult) {
    console.log("SESSAO")
    const expiresAt = moment().add(authResult.expiresIn, 'hour');
    console.log('data_expiracao', expiresAt)
    localStorage.setItem('token', authResult.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getToken(){
    return localStorage.getItem('token');
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
