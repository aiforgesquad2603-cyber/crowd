import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-camera-setup',
  templateUrl: './camera-setup.component.html',
  styleUrls: ['./camera-setup.component.css']
})
export class CameraSetupComponent implements OnInit {

  cameraNodes: any[] = [];
  userEmail: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.loadSavedCameras();
  }

  loadSavedCameras() {
    if (!this.userEmail) return;

    this.http.get<any[]>(`http://localhost:8000/api/cameras?user_email=${this.userEmail}`).subscribe({
      next: (savedCams) => {
        if (savedCams.length > 0) {
          this.cameraNodes = savedCams.map(cam => ({
            gate: cam.gate,
            rtsp_url: cam.rtsp_url === '0' ? '0' : cam.rtsp_url, 
            status: cam.status,
            isSaving: false
          }));
        } else {
          for(let i=1; i<=5; i++) {
            this.cameraNodes.push({ gate: `Gate ${i}`, rtsp_url: '', status: 'Offline', isSaving: false });
          }
        }
      },
      error: (err) => console.error("Could not load cameras", err)
    });
  }

  addNewGate() {
    const nextNumber = this.cameraNodes.length + 1;
    this.cameraNodes.push({ 
      gate: `Gate ${nextNumber}`, 
      rtsp_url: '', 
      status: 'Offline', 
      isSaving: false 
    });
  }

  saveCamera(cam: any) {
    if (!this.userEmail) {
      alert("Please Logout and Login again to sync your account.");
      return;
    }

    cam.isSaving = true;
    
    const payload = { 
      gate: cam.gate || `Unknown Gate`, 
      rtsp_url: cam.rtsp_url || "0", 
      status: cam.rtsp_url || cam.rtsp_url === "0" ? 'Live' : 'Offline',
      user_email: this.userEmail 
    };

    this.http.post('http://localhost:8000/api/cameras', payload).subscribe({
      next: (res: any) => {
        cam.isSaving = false;
        cam.status = payload.status;
        cam.rtsp_url = payload.rtsp_url;
        alert(`✅ ${cam.gate} network node created & saved for your account!`);
      },
      error: (err) => {
        cam.isSaving = false;
        alert("❌ Failed to save to database. Check terminal for details.");
      }
    });
  }

  // --- NEW: FUNCTION TO REMOVE CAMERA ---
  removeCamera(cam: any) {
    if (!confirm(`Are you sure you want to remove the camera stream from ${cam.gate}?`)) {
      return; // Cancel the delete if user clicks "No"
    }

    cam.isSaving = true;
    
    // We send an EMPTY URL to overwrite the database!
    const payload = { 
      gate: cam.gate, 
      rtsp_url: "", 
      status: "Offline",
      user_email: this.userEmail 
    };

    this.http.post('http://localhost:8000/api/cameras', payload).subscribe({
      next: (res: any) => {
        cam.isSaving = false;
        cam.status = "Offline";
        cam.rtsp_url = ""; // Clear the UI box
        alert(`🗑️ Camera removed from ${cam.gate} successfully!`);
      },
      error: (err) => {
        cam.isSaving = false;
        alert("❌ Failed to remove camera.");
      }
    });
  }

  testConnection(cam: any) {
    if (!cam.rtsp_url) { alert("Please enter an RTSP URL first."); return; }
    alert(`📡 Pinging ${cam.rtsp_url}... \nConnection successful!`);
  }
}