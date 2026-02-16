import { Component, OnInit } from '@angular/core';
import { ThresholdService } from '../../../../services/threshold.service';

@Component({
  selector: 'app-threshold-settings',
  templateUrl: './threshold-settings.component.html',
  styleUrls: ['./threshold-settings.component.css']
})
export class ThresholdSettingsComponent implements OnInit {

  // Model bound to the input field in your HTML
  crowdLimit: number | null = null;

  // Inject the ThresholdService to manage global state
  constructor(private thresholdService: ThresholdService) { }

  ngOnInit(): void {
    // Subscribe to the service when the component loads.
    // This ensures the input box always displays the currently active limit (e.g., 50).
    this.thresholdService.threshold$.subscribe(settings => {
      this.crowdLimit = settings.crowdLimitPerGate;
    });
  }

  saveThresholds() {
    // Basic validation to prevent saving empty or negative numbers
    if (!this.crowdLimit || this.crowdLimit <= 0) {
      alert('Please enter a valid crowd limit number.');
      return;
    }

    // Call the service to broadcast the new limit to the rest of the application
    this.thresholdService.updateThreshold(this.crowdLimit);
    
    // Provide feedback to the user and the console
    console.log('Saved new threshold limit:', this.crowdLimit);
    alert(`System threshold successfully updated to ${this.crowdLimit} people per gate.`);
  }
}