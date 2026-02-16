import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  
  // Toggle between Login and Signup screens
  isLoginMode: boolean = true; 
  isLoading: boolean = false;

  // Form Data
  authData: any = {
    name: '',
    email: '',
    mobile: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    this.isLoading = true;
    
    if (this.isLoginMode) {
      // SIGN IN
      const loginPayload = { email: this.authData.email, password: this.authData.password };
      
      this.http.post('http://localhost:8000/api/login', loginPayload).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          // Save success token and navigate to dashboard!
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', res.name);
          // Redirect to Dashboard and refresh layout
          window.location.href = '/dashboard'; 
        },
        error: (err) => {
          this.isLoading = false;
          alert("❌ " + (err.error.detail || "Login Failed"));
        }
      });

    } else {
      // SIGN UP
      this.http.post('http://localhost:8000/api/signup', this.authData).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          alert("✅ Registration Successful! Please Login.");
          this.isLoginMode = true; // Switch back to login screen
        },
        error: (err) => {
          this.isLoading = false;
          alert("❌ " + (err.error.detail || "Registration Failed"));
        }
      });
    }
  }
}