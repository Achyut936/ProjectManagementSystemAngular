import { Component, OnInit } from '@angular/core';
import { SupaService } from '../Service/supa.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  loggedInUserName: string = '';
  storedName = localStorage.getItem('userName');

  ngOnInit() {
    this.loggedInUserName = this.storedName ?? '';
  }

  constructor(private auth: SupaService, private router: Router, private ngxService: NgxUiLoaderService) {}

  getUserEmail(): string {
    return localStorage.getItem('userEmail') || 'Guest';
  }

  logOut() {
    this.ngxService.start();
    this.auth.signOut().then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
      this.ngxService.stop();
      this.router.navigate(['/login']);
    });
  }
}