import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupaService } from '../Service/supa.service';
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
    private auth: SupaService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      console.log('Login submitted', this.loginForm.value);
      this.auth
        .signIn(this.loginForm.value.email, this.loginForm.value.password)
        .then((result) => {
          console.log(result);
          if (result.data.user?.role === 'authenticated') {
            this.router.navigate(['/dashboard']);
          } else {
            
            alert('Invalid credentials. Please try again.');
          }
        })
        .catch((error) => {
          console.log(error);
          
          alert('An error occurred during login. Please try again.');
        });
    } else {
      
      alert('Invalid form. Please fill in all required fields.');
    }
  }
}
