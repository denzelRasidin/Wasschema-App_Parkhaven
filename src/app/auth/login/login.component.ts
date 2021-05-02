import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoaderService } from '../../shared/loader/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private LoaderService:LoaderService) {
  }

  ngOnInit() {
    // this.LoaderService.show();
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: ''
    });
  }

  login() {
    const username = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    const rememberMe = this.loginForm.value.rememberMe;
    console.log(username + ' - ' + password + ' - ' + rememberMe);

    if (rememberMe) {
      this.authService.rememberMe()
        this.authService.login(username, password);
      console.log(rememberMe)
    }
    else {
      this.authService.login(username, password);
      console.log(username, password)
    }
  }

}
