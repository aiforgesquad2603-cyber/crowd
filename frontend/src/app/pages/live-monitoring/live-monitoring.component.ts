import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-live-monitoring',
  templateUrl: './live-monitoring.component.html',
  styleUrls: ['./live-monitoring.component.css']
})
export class LiveMonitoringComponent implements OnInit {
  
  cameraNodes: any[] = [];
  selectedCamera: any = null;
  liveStreamUrl: string = '';
  
  // Track which view is currently active
  currentMode: string = 'object'; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCameras();
  }

  loadCameras() {
    this.http.get<any[]>('http://localhost:8000/api/cameras').subscribe({
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

  // --- NEW: Toggle Function! ---
  setMode(newMode: string) {
    this.currentMode = newMode;
    this.updateStreamUrl();
  }

  updateStreamUrl() {
    if (this.selectedCamera && (this.selectedCamera.status === 'Live' || this.selectedCamera.rtsp_url === '0')) {
      // We append a random timestamp so the browser instantly refreshes the image feed!
      const t = new Date().getTime();
      this.liveStreamUrl = `http://localhost:8000/api/video-feed/${this.selectedCamera.gate}?mode=${this.currentMode}&t=${t}`;
    } else {
      this.liveStreamUrl = '';
    }
  }
}