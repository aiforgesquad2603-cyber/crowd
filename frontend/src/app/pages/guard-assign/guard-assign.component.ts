import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // <-- Changed to HttpClient for consistency

@Component({
  selector: 'app-guard-assign',
  templateUrl: './guard-assign.component.html',
  styleUrls: ['./guard-assign.component.css']
})
export class GuardAssignComponent implements OnInit {

  // We updated the names to match your real gates!
  zones = [
    { id: 'Z1', name: 'Gate 1', risk: 'Critical', deployed: 2, selectedGuard: '' },
    { id: 'Z2', name: 'Gate 2', risk: 'High', deployed: 1, selectedGuard: '' },
    { id: 'Z3', name: 'Gate 3', risk: 'Moderate', deployed: 0, selectedGuard: '' },
    { id: 'Z4', name: 'Gate 4', risk: 'Low', deployed: 1, selectedGuard: '' }
  ];

  // This will now hold your REAL guards from MongoDB
  guards: any[] = [];
  
  // --- NEW: Multi-tenant Account ID ---
  userEmail: string = ''; 

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // 1. Securely fetch the logged-in user's email
    this.userEmail = localStorage.getItem('userEmail') || '';
    
    // Automatically fetch real guards when the page opens!
    this.loadRealGuards();
  }

  loadRealGuards() {
    if (!this.userEmail) return; // Stop if no email

    // 2. Pass the user_email to the backend to get ONLY their guards
    this.http.get<any[]>(`http://localhost:8000/api/guards?user_email=${this.userEmail}`).subscribe({
      next: (data) => {
        this.guards = data; 
      },
      error: (err) => {
        console.error("Failed to load real guards from database", err);
      }
    });
  }

  // Only show guards who are 'Active' in the dropdown menu
  getAvailableGuards() {
    return this.guards.filter(guard => guard.status === 'Active');
  }

  dispatchGuard(zone: any) {
    if (!zone.selectedGuard) {
      alert('Please select an available unit first!');
      return;
    }

    // Find the real guard using their unique MongoDB ID
    const guard = this.guards.find(g => g.id === zone.selectedGuard);
    if (guard) {
      guard.status = 'Responding'; // Update status to red instantly
      zone.deployed += 1; 
      alert(`🚨 Dispatching ${guard.name} to ${zone.name} immediately.`);
    }

    // Reset the dropdown
    zone.selectedGuard = '';
  }

  broadcastMessage() {
    alert("📢 Broadcasting emergency message to all active units...");
  }
}