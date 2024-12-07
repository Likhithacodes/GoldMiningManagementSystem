import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginData = {
    username: '',
    email: '',
    password: '',
  };

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.loginData).subscribe({
      next: (res: any) => {
        console.log(res.token);
        localStorage.setItem('jwt-token', res.token);
        alert('Login successful!');
        this.router.navigate(['/Home']);
      },
      error: (err) => alert(`Error: ${err.error}`),
    });
    this.loginData = {
      username: '',
      email: '',
      password: '',
    };
  }
  
}
