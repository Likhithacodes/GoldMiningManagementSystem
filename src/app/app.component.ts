import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { SitesComponent } from './routes/sites/sites.component';
import { FooterComponent } from './shared/footer/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HttpClientModule,SidebarComponent,NavbarComponent,CommonModule,SitesComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'GoldMiningManagementFrontend';
  userRole: string = ''; 
  isAuthenticated = false; 
  constructor(private authService: AuthService) {
    this.setUserRole();
    this.subscribeToAuthChanges();
    this.initializeAppState();
  }
 
  setUserRole() {
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log('Is Authenticated:', this.isAuthenticated);
  
    if (this.isAuthenticated) {
      const role = this.authService.getUserRole();
      console.log('Fetched Role:', role);
      this.userRole = role ?? ''; // Ensure userRole gets set correctly
    }
  }
  subscribeToAuthChanges() {
    this.authService.isAuthenticated$.subscribe((status) => {
      this.isAuthenticated = status;
      console.log('Authentication Status Updated:', status); // Debugging
      if (status) {
        this.userRole = this.authService.getUserRole() ?? '';
        console.log('User Role Updated:', this.userRole); // Debugging
      } else {
        this.userRole = ''; // Clear user role on logout
      }
    });
  }
  initializeAppState() {
    // Ensure proper initialization of authentication state and role
    this.isAuthenticated = this.authService.isAuthenticated();
    console.log('Is Authenticated:', this.isAuthenticated);

    if (this.isAuthenticated) {
      const role = this.authService.getUserRole();
      console.log('Fetched Role:', role);
      this.userRole = role ?? ''; // Ensure userRole gets set correctly
    }
  }
  
}
