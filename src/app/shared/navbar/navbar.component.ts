import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  username: string | null = null;
  constructor(private authService: AuthService, private router: Router) {
    this.username = this.authService.getUsername(); // Fetch username from service
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
