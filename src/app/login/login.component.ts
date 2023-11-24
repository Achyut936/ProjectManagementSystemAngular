import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupaService } from '../Service/supa.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginEmail = '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: SupaService,
    private toastr: ToastrService,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLoginSubmit() {
    this.ngxService.start();

    if (
      this.loginForm.get('email')?.value.trim() === '' ||
      this.loginForm.get('password')?.value === ''
    ) {
      this.toastr.error('Email and password are required fields.');
      return;
    }

    if (this.loginForm.valid) {
      console.log('Login submitted', this.loginForm.value);

      this.auth
        .signIn(this.loginForm.value.email, this.loginForm.value.password)
        .then(async (result) => {
          console.log(result);

          if (result.data.user?.role === 'authenticated') {
            const userEmail = result.data.user?.email ?? 'unknown';

            const { data: userData, error: fetchError } =
              await this.auth.supabaseClient
                .from('projectAuthTable')
                .select('fullName') // Add 'firstName' to the select query
                .eq('email', userEmail)
                .single();

            if (fetchError) {
              this.ngxService.stop();
              console.error('Fetch user data error:', fetchError);
              return;
            } else if (userData) {
              const { fullName } = userData;
              localStorage.setItem('userName', fullName);
              this.ngxService.stop();
              this.toastr.success('Login Successful');
              localStorage.setItem('token', '847581de5f3a');
              this.router.navigate(['/dashboard']);
            } else {
              this.ngxService.stop();
              this.toastr.error('Invalid credentials. Please try again.');
            }
          }
        })
        .catch((error) => {
          this.ngxService.stop();
          console.log(error);
          this.toastr.error(
            'An error occurred during login. Please try again.'
          );
        });
    } else {
      this.ngxService.stop();
      this.toastr.error('Invalid form. Please fill in all required fields.');
    }
  }
}
