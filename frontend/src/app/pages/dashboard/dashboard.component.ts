import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  
  // Dynamic Variables
  policeDeployed: number = 0;
  totalCrowdEstimate: number = 1450;
  activeAlerts: number = 0;
  
  // To store cameras that actually have RTSP links
  activeCameras: any[] = [];
  
  // Timer for simulating live crowd movement
  crowdInterval: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRealTimeData();

    // Simulates a live changing crowd count for the Hackathon Demo!
    this.crowdInterval = setInterval(() => {
      // Randomly increase or decrease crowd by -5 to +10
      const change = Math.floor(Math.random() * 16) - 5; 
      this.totalCrowdEstimate += change;
      
      // Dynamic Alert Logic
      if (this.totalCrowdEstimate > 1600) {
        this.activeAlerts = 2; // Critical High
      } else if (this.totalCrowdEstimate > 1500) {
        this.activeAlerts = 1; // Warning
      } else {
        this.activeAlerts = 0; // Normal
      }
    }, 3000); // Changes every 3 seconds
  }

  fetchRealTimeData() {
    // 1. Get exact number of Guards deployed from MongoDB
    this.http.get<any[]>('http://localhost:8000/api/guards').subscribe({
      next: (guards) => {
        this.policeDeployed = guards.length;
      },
      error: (err) => console.error(err)
    });

    // 2. Get all configured Cameras from MongoDB
    this.http.get<any[]>('http://localhost:8000/api/cameras').subscribe({
      next: (cams) => {
        // Filter out offline cameras, only keep ones with URLs
        this.activeCameras = cams.filter(c => c.rtsp_url && c.rtsp_url.trim() !== '');
      },
      error: (err) => console.error(err)
    });
  }

  ngOnDestroy() {
    // Stop the timer when we leave the page
    if (this.crowdInterval) {
      clearInterval(this.crowdInterval);
    }
  }
}