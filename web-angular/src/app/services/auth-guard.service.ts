import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private Auth: AuthService) { }

  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | boolean {
        //console.log(route.url[0].path)
      if (this.Auth.isLoggedIn()) {
        if(route.url[0].path == 'auth'){
          //console.log('if');
          this.router.navigate(['']);
        }else{
          return true;
        }
        
      } else {
          if(route.url[0].path == 'auth'){
            return true;
          }
          
          this.router.navigate(['']);
      }
  }
}