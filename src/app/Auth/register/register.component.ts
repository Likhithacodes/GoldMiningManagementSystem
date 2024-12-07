import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  signupData = {
    username: '',
    email: '',
    password: '',
    role: '',
  };

  constructor(private authService: AuthService,private router:Router) {}

  onSubmit() {
    this.authService.signup(this.signupData).subscribe({
      next: () => {
        alert('Signup successful');
        this.router.navigate(['/login']); // Redirect to the login page
      },
      error: (err) => {
        console.error('Signup Error:', err);
        alert(`Error: ${err.error.Message || 'An error occurred'}`);
      },
    });
    this.signupData = {
      username: '',
      email: '',
      password: '',
      role: '',
    };
  }
}
