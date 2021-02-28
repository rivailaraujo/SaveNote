import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | boolean {
        console.log(route.url[0].path)
      if (localStorage['token'] != null) {
        
        if(route.url[0].path == 'auth'){
          console.log('if');
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