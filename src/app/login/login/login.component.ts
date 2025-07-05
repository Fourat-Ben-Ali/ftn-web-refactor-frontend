import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { formInputs, InputType, LoginRequest } from 'models';
import { AuthenticationService } from 'shared/services/authentication.service';
import { ToastService } from 'shared/services/toast.service';
import { TokenService } from 'shared/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  loginInputs: formInputs[] = [
    {
      label: 'Email',
      type: InputType.EMAIL,
      className: 'login-inputs',
      placeholder: 'Enter your email',
      control: new FormControl('', [Validators.required, Validators.email]),
      errorMessages: {
        required: 'Email is required.',
        email: 'Please enter a valid email.',
      },
    },
    {
      label: 'Password',
      type: InputType.PASSWORD,
      className: 'login-inputs',
      placeholder: 'Enter your password',
      control: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
      errorMessages: {
        required: 'Password is required.',
        minlength: 'Password must be at least 6 characters long.',
      },
    },
  ];

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private tokenService: TokenService,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: this.loginInputs[0].control,
      password: this.loginInputs[1].control,
    });
  }

  getInputIcon(type: InputType): string {
    switch (type) {
      case InputType.EMAIL:
        return 'pi pi-envelope';
      case InputType.PASSWORD:
        return 'pi pi-lock';
      default:
        return 'pi pi-user';
    }
  }

  getInputType(type: InputType): string {
    switch (type) {
      case InputType.EMAIL:
        return 'email';
      case InputType.PASSWORD:
        return 'password';
      default:
        return 'text';
    }
  }

  getErrorMessages(input: formInputs): string[] {
    const errors: string[] = [];
    const control = input.control;
    
    if (control.errors) {
      Object.keys(control.errors).forEach(key => {
        if (input.errorMessages && input.errorMessages[key as keyof typeof input.errorMessages]) {
          errors.push(input.errorMessages[key as keyof typeof input.errorMessages] as string);
        }
      });
    }
    
    return errors;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    this.isLoading = true;
    const loginRequest: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.authenticate(loginRequest);
  }

  authenticate(loginRequest: LoginRequest) {
    this.authenticationService
      .authenticateAndStoreToken(loginRequest)
      .subscribe({
        next: () => {
          this.toastService.showCustom(
            'Login successful.',
            'success',
            'Welcome back!'
          );

          this.redirectByUserRole();
        },
        error: (error) => {
          this.toastService.showError('Login failed. Please try again.');
          console.error('Login failed:', error);
          this.isLoading = false;
        },
      });
  }

  redirectByUserRole() {
    this.tokenService.redirectByUserRole();
  }
}
