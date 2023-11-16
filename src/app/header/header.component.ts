import { Component } from '@angular/core';
import { SupaService } from '../Service/supa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  constructor(private auth: SupaService, private router: Router) {}
  logOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
