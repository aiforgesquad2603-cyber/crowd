import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-guard-register',
  templateUrl: './guard-register.component.html',
  styleUrls: ['./guard-register.component.css']
})
export class GuardRegisterComponent implements OnInit {

  guardName: string = '';
  mobileNumber: string = '';
  assignedGate: string = '';
  
  gates: string[] = ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5'];

  // --- NEW: Multi-tenant Account ID ---
  userEmail: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // 1. Securely fetch the logged-in user's email from browser memory
    this.userEmail = localStorage.getItem('userEmail') || '';
  }

  registerGuard() {
    // 1. Check if fields are empty
    if (!this.guardName || !this.mobileNumber || !this.assignedGate) {
      alert('Please fill in all the fields!');
      return;
    }

    // 🔒 Security Check: Make sure email exists
    if (!this.userEmail) {
      alert('Security Lock: Please Logout and Login again to sync your account.');
      return;
    }

    // 2. Format the data for the Python Backend WITH EMAIL
    const newGuard = {
      name: this.guardName,
      mobile: this.mobileNumber,
      gate: this.assignedGate,
      status: 'Active',
      user_email: this.userEmail // <-- THIS MAGIC KEY FIXES THE 422 ERROR!
    };

    // 3. Send to Database
    this.apiService.addGuard(newGuard).subscribe({
      next: (response) => {
        // Clear the form
        this.guardName = '';
        this.mobileNumber = '';
        this.assignedGate = '';
        
        // Tell the table to update
        this.apiService.notifyGuardsUpdated();
        
        // Show success message
        alert('✅ Guard successfully registered to your account!');
      },
      error: (error) => {
        console.error('Error saving guard:', error);
        alert('❌ Failed to save to database. Check console for details.');
      }
    });
  }
}