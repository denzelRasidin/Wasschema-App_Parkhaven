import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
              private router: Router,
              private snackBar: MatSnackBar,
              public auth: AuthService,
              // public jwt:jwt
              ) {
  }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   return this.afAuth.user.pipe(map(user => {
  //     if (user) {
  //       if (state.url.startsWith('/room/')) {
  //         this.router.navigate(['']);
  //       }
  //       return true;
  //     } else {
  //       this.router.navigate(['login']).then(() => {
  //         this.snackBar.open('Your session has expired.', 'OK');
  //       });
  //       return false;
  //     }
  //   }));
  // }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Observable<boolean> | Promise<boolean> | boolean {
   const tokenBase64 =  localStorage.getItem('token')
    console.log(tokenBase64);
    // var jwt = require('jsonwebtoken');
    const helper = new JwtHelperService();

    const decodedToken = helper.decodeToken(tokenBase64);
    const expirationDate = helper.getTokenExpirationDate(tokenBase64);
    var isExpired = helper.isTokenExpired(tokenBase64);
    console.log(decodedToken)
    console.log(expirationDate)
    console.log(isExpired)
    // const token = jwt.decode(tokenBase64);
    // const tokenExpirationDate = token.exp
    // console.log(tokenExpirationDate);
    // if (!this.auth.isAuthenticated()) {
    //   return false;
    // }
    if (isExpired == false) {
      if (state.url.startsWith('/room/')) {
        this.router.navigate(['']);
      }
      return true;
    } else {
      this.router.navigate(['login']).then(() => {
        this.snackBar.open('Your session has expired.', 'OK');
      });
      return false;
    }
    // this.router.navigate(['login'])
    // return false;
  }
}
