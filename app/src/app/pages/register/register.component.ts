import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { ValidationErrorsService } from '../../shared/validation/services/validation-errors.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']

})
export class RegisterComponent implements OnInit {
  registerForm = this.fb.group({
    username: ['', [
      Validators.required,
      Validators.minLength(4)],
      [this.validation.forbiddenNameValidator()]
    ],
    password: ['', [
      Validators.required,
      Validators.minLength(4)]
    ],
    confirmPassword: ['', [
      Validators.required,
    ]
    ],
    email: ['', [
      Validators.required,
      Validators.email]
    ],
    birthdate: ['', [
      Validators.required]
    ],
  }, { validator: this.validation.passwordConfirming });
  user: User;
  get username() { return this.registerForm.value.username; }
  get password() { return this.registerForm.value.password; }
  get confirmPassword() { return this.registerForm.value.confirmPassword; }
  get email() { return this.registerForm.value.email; }
  get birthdate() { return this.registerForm.value.birthdate; }

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder, private validation: ValidationErrorsService) { }

  ngOnInit(): void {
  }

  register() {
    if (
      this.registerForm.valid) {
      this.user = { username: this.username, password: this.password, email: this.email, birthdate: this.birthdate };
      this.userService.create(this.user).subscribe((result) => {
        this.router.navigate(['/login', { success: true }]);
      },
        (error) => {
          if (error.status) {
            console.log(error);
          }
        });
    }
  }

  showErrors(errorName) {
    console.log(this.registerForm.get(errorName).errors);
  }
}
