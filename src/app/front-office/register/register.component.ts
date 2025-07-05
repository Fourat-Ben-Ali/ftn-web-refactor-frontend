import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { formInputs, InputType } from 'models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading: boolean = false;
  registerInputs: formInputs[] = [
    {
      label: 'First Name',
      type: InputType.TEXT,
      className: 'register-inputs',
      placeholder: 'Enter your first name',
      control: new FormControl('', [Validators.required]),
      errorMessages: {
        required: 'First name is required.'
      },
    },
    {
      label: 'Last Name',
      type: InputType.TEXT,
      className: 'register-inputs',
      placeholder: 'Enter your last name',
      control: new FormControl('', [Validators.required]),
      errorMessages: {
        required: 'Last name is required.'
      },
    },
    {
      label: 'Email',
      type: InputType.EMAIL,
      className: 'register-inputs',
      placeholder: 'Enter your email',
      control: new FormControl('', [Validators.required, Validators.email]),
      errorMessages: {
        required: 'Email is required.',
        email: 'Please enter a valid email.'
      },
    },
    {
      label: 'Password',
      type: InputType.PASSWORD,
      className: 'register-inputs',
      placeholder: 'Enter your password',
      control: new FormControl('', [Validators.required, Validators.minLength(6)]),
      errorMessages: {
        required: 'Password is required.',
        minlength: 'Password must be at least 6 characters long.'
      },
    },
    {
      label: 'Confirm Password',
      type: InputType.PASSWORD,
      className: 'register-inputs',
      placeholder: 'Confirm your password',
      control: new FormControl('', [Validators.required]),
      errorMessages: {
        required: 'Please confirm your password.'
      },
    },
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.registerForm = this.fb.group({
      firstname: this.registerInputs[0].control,
      lastname: this.registerInputs[1].control,
      email: this.registerInputs[2].control,
      password: this.registerInputs[3].control,
      confirmPassword: this.registerInputs[4].control,
    }, { validators: this.passwordsMatchValidator });
  }

  getInputIcon(type: InputType): string {
    switch (type) {
      case InputType.EMAIL:
        return 'pi pi-envelope';
      case InputType.PASSWORD:
        return 'pi pi-lock';
      case InputType.TEXT:
        return 'pi pi-user';
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
    // Custom error for password mismatch
    if (input.label === 'Confirm Password' && this.registerForm.errors?.['passwordMismatch'] && control.touched) {
      errors.push('Passwords do not match.');
    }
    return errors;
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      Object.values(this.registerForm.controls).forEach((control) => {
        control.markAsTouched();
      });
      return;
    }
    this.isLoading = true;
    const { confirmPassword, ...registerData } = this.registerForm.value;
    this.authService.register(registerData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registration successful! Please login.'
        });
        this.router.navigate(['/front-office/login']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Registration failed. Please try again.'
        });
        this.isLoading = false;
      }
    });
  }
} 