import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-guard-assign-modal',
  templateUrl: './guard-assign-modal.component.html',
  styleUrls: ['./guard-assign-modal.component.css']
})
export class GuardAssignModalComponent implements OnChanges {

  // --- THESE @Input TAGS ARE WHAT FIX THE RED TERMINAL ERROR ---
  @Input() isOpen: boolean = false;
  @Input() guardData: any = null; 

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveAssignment = new EventEmitter<any>();

  // Dropdown options for Gates 1-10
  selectedGate: string = '';
  gates: string[] = Array.from({ length: 10 }, (_, i) => `Gate ${i + 1}`);

  constructor() { }

  // When the "Edit" button is clicked, pre-fill the dropdown with their current gate
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['guardData'] && this.guardData) {
      this.selectedGate = this.guardData.gate;
    }
  }

  onClose() {
    this.closeModal.emit();
  }

  onSave() {
    if (!this.selectedGate) {
      alert('Please select a gate to assign.');
      return;
    }

    const updatedGuard = {
      ...this.guardData,
      gate: this.selectedGate
    };
    
    this.saveAssignment.emit(updatedGuard);
    this.onClose();
  }
}