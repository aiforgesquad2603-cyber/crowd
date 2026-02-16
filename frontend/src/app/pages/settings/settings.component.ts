import { Component } from '@angular/core';
import { GuardService } from '../../services/guard.service'; // Import the service

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  
  // Variables to control the modal popup
  isModalOpen: boolean = false;
  selectedGuardForEdit: any = null;

  constructor(private guardService: GuardService) { }

  // 1. Triggered when you click "Edit" in the Guard List
  openEditModal(guard: any) {
    this.selectedGuardForEdit = guard;
    this.isModalOpen = true; // This opens the popup!
  }

  // 2. Triggered when you click "Cancel" or the "X" in the modal
  closeModal() {
    this.isModalOpen = false; // This closes the popup
    this.selectedGuardForEdit = null;
  }

  // 3. Triggered when you click "Confirm Assignment" in the modal
  saveGuardAssignment(updatedGuard: any) {
    this.guardService.updateGuard(updatedGuard); // Instantly updates the table!
    this.closeModal(); // Close the popup after saving
  }
}