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

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {}

  registerGuard() {
    // 1. Check if fields are empty
    if (!this.guardName || !this.mobileNumber || !this.assignedGate) {
      alert('Please fill in all the fields!');
      return;
    }

    // 2. Format the data for the Python Backend
    const newGuard = {
      name: this.guardName,
      mobile: this.mobileNumber,
      gate: this.assignedGate,
      status: 'Active'
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
      },
      error: (error) => {
        console.error('Error saving guard:', error);
        alert('Failed to save. Is your Python backend running?');
      }
    });
  }
}