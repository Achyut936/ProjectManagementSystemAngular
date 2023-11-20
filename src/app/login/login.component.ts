import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupaService } from '../Service/supa.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: SupaService,private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLoginSubmit() {
    if (this.loginForm.get('email')?.value.trim() === '' || this.loginForm.get('password')?.value === '') {
      this.toastr.error('Email and password are required fields.');
      return;
    }

    if (this.loginForm.valid) {
      console.log('Login submitted', this.loginForm.value);
      this.auth
        .signIn(this.loginForm.value.email, this.loginForm.value.password)
        .then((result) => {
          console.log(result);
          if (result.data.user?.role === 'authenticated') {
            this.toastr.success("Login Successful")
            this.router.navigate(['/dashboard']);
          } else {
            this.toastr.error('Invalid credentials. Please try again.');
          }
        })
        .catch((error) => {
          console.log(error);
          this.toastr.error('An error occurred during login. Please try again.');
        });
    } else {
      this.toastr.error('Invalid form. Please fill in all required fields.');
    }
  }
}
