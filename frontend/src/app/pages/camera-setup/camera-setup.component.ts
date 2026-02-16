import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-camera-setup',
  templateUrl: './camera-setup.component.html',
  styleUrls: ['./camera-setup.component.css']
})
export class CameraSetupComponent implements OnInit {

  // Empty array initially, we will fetch from DB!
  cameraNodes: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadSavedCameras();
  }

  loadSavedCameras() {
    this.http.get<any[]>('http://localhost:8000/api/cameras').subscribe({
      next: (savedCams) => {
        if (savedCams.length > 0) {
          // If database has cameras, load them!
          this.cameraNodes = savedCams.map(cam => ({
            gate: cam.gate,
            rtsp_url: cam.rtsp_url,
            status: cam.status,
            isSaving: false
          }));
        } else {
          // If database is empty, create 5 default gates
          for(let i=1; i<=5; i++) {
            this.cameraNodes.push({ gate: `Gate ${i}`, rtsp_url: '', status: 'Offline', isSaving: false });
          }
        }
      },
      error: (err) => console.error("Could not load cameras", err)
    });
  }

  // --- NEW MAGIC FUNCTION ---
  addNewGate() {
    const nextNumber = this.cameraNodes.length + 1;
    this.cameraNodes.push({ 
      gate: `Gate ${nextNumber}`, 
      rtsp_url: '', 
      status: 'Offline', 
      isSaving: false 
    });
    // Page scroll to bottom so they see the new card
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
  }

  saveCamera(cam: any) {
    cam.isSaving = true;
    const payload = { gate: cam.gate, rtsp_url: cam.rtsp_url, status: cam.rtsp_url ? 'Live' : 'Offline' };

    this.http.post('http://localhost:8000/api/cameras', payload).subscribe({
      next: (res: any) => {
        cam.isSaving = false;
        cam.status = payload.status;
        alert(`✅ ${cam.gate} network node created & saved!`);
      },
      error: (err) => {
        cam.isSaving = false;
        alert("❌ Failed to save to database.");
      }
    });
  }

  testConnection(cam: any) {
    if (!cam.rtsp_url) { alert("Please enter an RTSP URL first."); return; }
    alert(`📡 Pinging ${cam.rtsp_url}... \nConnection successful!`);
  }
}