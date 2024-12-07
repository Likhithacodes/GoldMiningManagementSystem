import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as string[]; // Retrieve roles as an array
    console.log('Allowed Roles:', allowedRoles);

    const userRole = this.authService.getUserRole(); // Fetch the user's role
    console.log('User Role:', userRole);

    // Check if user's role matches any of the allowed roles
    if (userRole && allowedRoles && allowedRoles.includes(userRole)) {
      return true; // Allow navigation
    }


    this.router.navigate(['/login']); 
    return false; 
  }
}
