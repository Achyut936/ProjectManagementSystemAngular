import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupaService } from '../Service/supa.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private auth: SupaService,private toastr: ToastrService) {}

  ngOnInit() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/),
        ],
      ],
    });
  }

  onSignupSubmit() {
    if (this.signupForm.valid) {
      console.log('Signup submitted', this.signupForm.value);
      this.auth
        .signUp(this.signupForm.value.email, this.signupForm.value.password)
        .then(() => {
          // Display a success alert
          // alert('Signup successful!');
          this.toastr.success('Signup Successful');
          this.router.navigate(['/login']);
        })
        .catch((error) => {
          console.log(error);
          // alert('An error occurred during signup. Please try again.');
          
          this.toastr.error("An error occurred during signup. Please try again.")
        });
    }
  }
}
  
