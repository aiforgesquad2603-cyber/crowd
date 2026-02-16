import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // <-- Router is needed to kick users out!

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  title = 'frontend';

  // Inject the Router so we can navigate pages programmatically
  constructor(private router: Router) {}

  ngOnInit() {
    // 🔒 SECURITY LOCK: App load aagumpothu login aagalana, direct ah veliya anuppidu!
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  // Check if token exists in browser memory (Local Storage)
  get isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  // Logout Function - Clears data and locks the app!
  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    
    // Hard reload back to login screen to clear everything
    window.location.href = '/login'; 
  }
}