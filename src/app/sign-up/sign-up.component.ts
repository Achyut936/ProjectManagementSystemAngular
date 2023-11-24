import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { environment } from 'src/enviornment';
import { Router } from '@angular/router';
import { SupaService } from '../Service/supa.service';

import { createClient } from '@supabase/supabase-js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;
  uid = Math.floor(10000 + Math.random() * 9000);
  supabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseKey
  );
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: SupaService,
    private toastr:ToastrService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit() {
    
    this.signupForm = this.fb.group(
      {fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password === confirmPassword) {
      return null;
    } else {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
  }

  async onSignupSubmit() {
    this.ngxService.start();
    const existingUser = await this.supabaseClient
      .from('projectAuthTable')
      .select('*')
      .eq('email', this.signupForm.value.email)
      .single();

    if (existingUser.data) {
      this.ngxService.stop();
      // User already exists
      this.toastr.error('User with this email already exists');
      return;
    }

    if (this.signupForm.valid) {
      const { email, password,fullName } = this.signupForm.value;
      const id = this.uid; // Generate a UUID for the user

      console.log('Signup submitted', { email, password, id });

      this.auth
        .signUp(email, password)
        .then(async () => {
          const { data, error } = await this.supabaseClient
            .from('projectAuthTable')
            .upsert([{ id, email, password,fullName }]);
            this.ngxService.stop();
          this.toastr.success('Signup Successful');
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          console.log(error);
          this.ngxService.stop();
          this.toastr.error(
            
            'An error occurred during signup. Please try again.'
          );
        });
    }
  }
}
