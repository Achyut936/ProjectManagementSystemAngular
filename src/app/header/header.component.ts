import { Component } from '@angular/core';
import { SupaService } from '../Service/supa.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private auth: SupaService, private router: Router,private ngxService: NgxUiLoaderService) {}
  logOut() {this.ngxService.start();
    this.auth.signOut().then(() => {
      localStorage.removeItem('token');
      this.ngxService.stop();
      this.router.navigate(['/login']);
    });
  }
}
