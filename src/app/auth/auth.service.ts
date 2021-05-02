import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { LoaderService } from '../shared/loader/loader.service';
import { map } from 'rxjs/operators';

@Injectable()
export class AuthService {
  CurrentSignedInUser:any
  constructor(
              private loaderService: LoaderService,
              private router: Router,
              private http: HttpClient,
              private snackBar: MatSnackBar,
              ) {
  }

  // login(email: string, password: string) {
  //   this.loaderService.show();
  //   this.afAuth.auth.signInWithEmailAndPassword(email, password)
  //     .then(loginData => {
  //       console.log('logged in ', loginData);
  //       this.router.navigate(['/']);
  //       this.loaderService.hide();
  //     }).catch(error => {
  //     console.log(error);
  //     this.snackBar.open('Incorrect email or password.', 'OK');
  //     this.loaderService.hide();
  //   });
  // }
  login(email: string, password: string){
    this.loaderService.show();
    console.log(email +'---' + password)
    let loginUrl = "http://85.145.70.161:8080/api/v1/building/woongebouw-parkhaven/account/login"
    let postData = {email : email ,password :password} ;
    this.http.post<any>(loginUrl, postData, {observe: 'response'}).subscribe(data => {
      // console.log(data.headers.get('authorization'));
      console.log("dada", data.body)
      console.log(data.headers)
      const a = data.headers
      localStorage.setItem('headers',JSON.stringify(a) )
      localStorage.setItem('token', data.headers.get('authorization'));
      localStorage.setItem('CurrentUser', JSON.stringify(data.body))
      // console.log(data)
      this.CurrentSignedInUser == data.body
      this.router.navigate(['/']);
      this.loaderService.hide();
    },
    error => {
      console.log(error);
          this.snackBar.open('Incorrect email or password.', 'OK');
          this.loaderService.hide();
    })
    }

  rememberMe() {
    // https://firebase.google.com/docs/auth/web/auth-state-persistence
    // return this.afAuth.auth.setPersistence('local');
  }

  register(user) {
    this.loaderService.show();

    this.http.post(`${environment.firebaseUrl}/signup`, user, {
      headers: {'Content-Type': 'application/json'}
    }).subscribe(() => {
      this.router.navigate(['/login']).then(() => {
        this.snackBar.open('Sign Up was successful.', 'OK');
      });
    }, error => {
      this.snackBar.open(error.error, 'OK');
      this.loaderService.hide();
    }, () => {
      this.loaderService.hide();
    });
  }

  forgotPassword(email: string) {
    this.loaderService.show();

    // this.afAuth.auth.sendPasswordResetEmail(email).then(() => {
    //   return this.router.navigate(['/login']);
    // }).then(() => {
    //   this.snackBar.open(`An email was sent to ${email}.`, 'OK');
    //   this.loaderService.hide();
    // }).catch(error => {
    //   this.snackBar.open(error.message, 'OK');
    //   this.loaderService.hide();
    // });
  }

  logout() {
  //  localStorage.removeItem('token')
    // this.afAuth.auth.signOut().then(() => {
    //   return this.router.navigate(['/login']);
    // });
  }

  fetchUserInformation() {
    // return this.afStore.collection('users').doc(this.afAuth.auth.currentUser.displayName);
  }

  getCurrentSignedInUser() {
   this.CurrentSignedInUser

  }

}
