import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode'; 
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:5117/api/Auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((response: any) => {
        this.saveToken(response.token); // Save the token
        this.isAuthenticatedSubject.next(true); // Notify subscribers that the user is authenticated
      })
    );
  }
  
  signup(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
    
  }
  saveToken(token: string): void {
    localStorage.setItem('jwt-token', token);
    this.isAuthenticatedSubject.next(true);
  }

  // Get token from local storage
  getToken(): string | null {
    return localStorage.getItem('jwt-token');
  }

  // Clear token and logout
  logout(): void {
    localStorage.removeItem('jwt-token');
    this.isAuthenticatedSubject.next(false);
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    console.log('Token:', token); // Add debugging
    return !!token;
  }
  
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) {
      console.log('No token found');
      return null;
    }
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded payload:', payload);
      return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']; 
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      // Decode the token payload
      const payload = JSON.parse(atob(token.split('.')[1])); // Extract the payload part of the JWT
      return payload?.sub || null; // Assuming "sub" is where the username is stored
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

 
}
