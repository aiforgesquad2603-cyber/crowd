import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// 1. IMPORT ANGULAR SECURITY BYPASS TOOLS
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; 

@Component({
  selector: 'app-live-monitoring',
  templateUrl: './live-monitoring.component.html',
  styleUrls: ['./live-monitoring.component.css']
})
export class LiveMonitoringComponent implements OnInit {
  
  cameraNodes: any[] = [];
  selectedCamera: any = null;
  
  // 2. CHANGE TYPE TO ACCEPT SAFE URLS
  liveStreamUrl: SafeResourceUrl | string = ''; 
  
  // Track which view is currently active
  currentMode: string = 'object'; 

  // Multi-tenant Account ID
  userEmail: string = '';

  // 3. INJECT THE SANITIZER HERE!
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Securely fetch the logged-in user's email
    this.userEmail = localStorage.getItem('userEmail') || '';
    
    // Load cameras for this account
    this.loadCameras();
  }

  loadCameras() {
    if (!this.userEmail) return; // Stop if no email

    // Fetch cameras ONLY for this specific user account!
    this.http.get<any[]>(`http://localhost:8000/api/cameras?user_email=${this.userEmail}`).subscribe({
      next: (cams) => {
        this.cameraNodes = cams;
        const firstLive = cams.find(c => c.status === 'Live' || c.rtsp_url === '0') || cams[0];
        if (firstLive) {
          this.selectCamera(firstLive);
        }
      },
      error: (err) => console.error("Error fetching cameras", err)
    });
  }

  selectCamera(cam: any) {
    this.selectedCamera = cam;
    this.updateStreamUrl();
  }

  // Toggle Function! 
  setMode(newMode: string) {
    this.currentMode = newMode;
    this.updateStreamUrl();
  }

  updateStreamUrl() {
    if (this.selectedCamera && (this.selectedCamera.status === 'Live' || this.selectedCamera.rtsp_url === '0')) {
      const t = new Date().getTime();
      const rawUrl = `http://localhost:8000/api/video-feed/${this.selectedCamera.gate}?user_email=${this.userEmail}&mode=${this.currentMode}&t=${t}`;
      
      // 4. SECURE STREAM BYPASS: Tell Angular this raw URL is 100% safe to display!
      this.liveStreamUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    } else {
      this.liveStreamUrl = '';
    }
  }
}