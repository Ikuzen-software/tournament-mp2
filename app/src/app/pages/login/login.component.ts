import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../users/user.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { LoginService } from './login.service';
import { Credentials } from './login-interfaces'
import * as action from '../../actions/login-page.actions'
import { Store } from '@ngrx/store';
import { ToastService } from 'src/app/shared/services/toast.service';
import { FormGroup, FormControl } from '@angular/forms';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']

})
export class LoginComponent implements OnInit {
 loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  })
  private credentials: Credentials;
  errorMessage = "";
  constructor(private router: Router, private store: Store<any>, private route: ActivatedRoute, private loginService: LoginService, private toastService: ToastService
  ) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params.success === "true") {
        this.toastService.success('Creation successful !', 'You can now login with your account')
      }
    });

  }
  onSubmit() {
    this.resetErrorMessage();
    if (this.loginForm.value.username && this.loginForm.value.password) {
      this.credentials = { username: this.loginForm.value.username, password: this.loginForm.value.password }
      this.loginService.login(this.credentials).pipe(take(1)).subscribe((result) => {
        this.router.navigate(["/tournaments"])
        this.toastService.success('successfully logged in', 'Welcome '+ this.loginForm.value.username);
      },
        (err) => {
          this.errorMessage = err.error.err;
          this.toastService.showError('login error', "something went wrong");
        });
    }
    else {
      this.errorMessage = "one of the fields are missing"
    }
  }
  passwordRecovery() {
    this.router.navigate(["/password-recovery"])
  }
  resetErrorMessage() {
    this.errorMessage = "";
  }
}
