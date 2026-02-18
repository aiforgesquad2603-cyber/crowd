import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  
  isLoginMode: boolean = true; 
  isForgotPasswordMode: boolean = false; // <-- NEW STATE!
  isLoading: boolean = false;

  authData: any = { name: '', email: '', mobile: '', password: '' };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.router.navigate(['/dashboard']);
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.isForgotPasswordMode = false;
  }

  // --- NEW: Trigger Forgot Password UI ---
  toggleForgotPassword() {
    this.isForgotPasswordMode = true;
    this.isLoginMode = false;
    this.authData.password = ''; // Clear password field
  }

  // --- NEW: Go back to Login ---
  backToLogin() {
    this.isForgotPasswordMode = false;
    this.isLoginMode = true;
  }

  onSubmit() {
    this.isLoading = true;
    
    // 1. FORGOT PASSWORD FLOW
    if (this.isForgotPasswordMode) {
      const resetPayload = { email: this.authData.email, new_password: this.authData.password };
      
      this.http.post('http://localhost:8000/api/reset-password', resetPayload).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          alert("✅ Password Reset Successful! Please Login with your new password.");
          this.backToLogin();
        },
        error: (err) => {
          this.isLoading = false;
          alert("❌ " + (err.error.detail || "Reset Failed"));
        }
      });
      return; // Stop here
    }

// 2. SIGN IN FLOW
    if (this.isLoginMode) {
      const loginPayload = { email: this.authData.email, password: this.authData.password };
      
      this.http.post('http://localhost:8000/api/login', loginPayload).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', res.name);
          localStorage.setItem('userEmail', res.email); // <-- NEW: SAVING THE UNIQUE ACCOUNT ID!
          window.location.href = '/dashboard';
        },
        error: (err) => {
          this.isLoading = false;
          alert("❌ " + (err.error.detail || "Login Failed"));
        }
      });
    }
    // 3. SIGN UP FLOW
    else {
      this.http.post('http://localhost:8000/api/signup', this.authData).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          alert("✅ Registration Successful! Please Login.");
          this.toggleMode(); 
        },
        error: (err) => {
          this.isLoading = false;
          alert("❌ " + (err.error.detail || "Registration Failed"));
        }
      });
    }
  }
}