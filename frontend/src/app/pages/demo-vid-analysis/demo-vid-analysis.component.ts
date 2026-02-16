import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Create a structure for each camera
interface CameraFeed {
  id: number;
  gateName: string;
  file: File | null;
  videoUrl: string | null;
  isAnalyzing: boolean;
  analysisResult: any;
  liveCount: number;
  showThermal: boolean;
  isAlarmRinging: boolean;
  alarmInterval: any;
}

@Component({
  selector: 'app-demo-vid-analysis',
  templateUrl: './demo-vid-analysis.component.html',
  styleUrls: ['./demo-vid-analysis.component.css']
})
export class DemoVidAnalysisComponent implements OnInit, OnDestroy {

  // Array to hold dynamic cameras
  cameras: CameraFeed[] = [];
  
  // To check if ANY alarm is ringing to show the global "Silence All" button
  get isAnyAlarmRinging(): boolean {
    return this.cameras.some(cam => cam.isAlarmRinging);
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // 1. DYNAMICALLY FETCH GATES FROM DATABASE!
    this.http.get<any[]>('http://localhost:8000/api/cameras').subscribe({
      next: (savedCams) => {
        let gateNames: string[] = [];
        
        if (savedCams.length > 0) {
          // If you created custom gates in RTSP setup, pull them all!
          gateNames = savedCams.map(c => c.gate);
        } else {
          // Fallback if database is completely empty
          gateNames = ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5']; 
        }

        // 2. Create a video box for EVERY gate dynamically!
        gateNames.forEach((name, index) => {
          this.cameras.push({
            id: index + 1,
            gateName: name,
            file: null,
            videoUrl: null,
            isAnalyzing: false,
            analysisResult: null,
            liveCount: 0,
            showThermal: false,
            isAlarmRinging: false,
            alarmInterval: null
          });
        });
      },
      error: (err) => {
        console.error("Failed to load dynamic gates from DB", err);
      }
    });
  }

  onFileSelected(event: any, index: number) {
    if (event.target.files && event.target.files.length > 0) {
      const cam = this.cameras[index];
      cam.file = event.target.files[0];
      cam.videoUrl = URL.createObjectURL(cam.file!);
      
      // Reset that specific camera's stats
      cam.analysisResult = null; 
      cam.liveCount = 0;
      cam.showThermal = false;
      this.stopSpecificAlarm(index);
    }
  }

  // Analyze ONE specific camera
  analyzeCamera(index: number) {
    const cam = this.cameras[index];
    if (!cam.file) return;

    cam.isAnalyzing = true;
    cam.analysisResult = null;
    cam.liveCount = 0;
    cam.showThermal = false;
    
    const formData = new FormData();
    formData.append('file', cam.file);
    formData.append('gate', cam.gateName); 

    this.http.post('http://localhost:8000/api/analyze-video', formData).subscribe({
      next: (response: any) => {
        cam.isAnalyzing = false;
        cam.analysisResult = response;
        this.animateCounting(index, response.crowdCount, response.thresholdExceeded);
      },
      error: (err) => {
        console.error(`Analysis Failed for ${cam.gateName}`, err);
        cam.isAnalyzing = false;
      }
    });
  }

  // Analyze ALL uploaded cameras at the same time!
  analyzeAllCameras() {
    this.cameras.forEach((cam, index) => {
      if (cam.file && !cam.isAnalyzing && !cam.analysisResult) {
        this.analyzeCamera(index);
      }
    });
  }

  animateCounting(index: number, targetCount: number, isCritical: boolean) {
    const cam = this.cameras[index];
    let current = 0;
    const interval = setInterval(() => {
      current += Math.ceil(targetCount / 20); // Dynamic counting speed
      if (current >= targetCount) {
        cam.liveCount = targetCount;
        clearInterval(interval);
        
        if (isCritical) {
          cam.showThermal = true;
          this.triggerAudioAlarm(index);
        }
      } else {
        cam.liveCount = current;
      }
    }, 50);
  }

  triggerAudioAlarm(index: number) {
    const cam = this.cameras[index];
    cam.isAlarmRinging = true;
    
    const message = `Critical! High crowd at ${cam.gateName}. Deploy guards to ${cam.gateName} immediately.`;
    const speech = new SpeechSynthesisUtterance(message);
    speech.lang = 'en-US';
    speech.pitch = 0.9;
    speech.volume = 1.0;

    window.speechSynthesis.speak(speech);

    cam.alarmInterval = setInterval(() => {
      window.speechSynthesis.speak(speech);
    }, 7000);
  }

  stopSpecificAlarm(index: number) {
    const cam = this.cameras[index];
    cam.isAlarmRinging = false;
    if (cam.alarmInterval) {
      clearInterval(cam.alarmInterval);
    }
  }

  stopAllAlarms() {
    this.cameras.forEach((_, index) => this.stopSpecificAlarm(index));
    window.speechSynthesis.cancel(); // Stops the voice immediately
  }

  clearCamera(index: number) {
    const cam = this.cameras[index];
    cam.file = null;
    cam.videoUrl = null;
    cam.analysisResult = null;
    cam.isAnalyzing = false;
    cam.showThermal = false;
    this.stopSpecificAlarm(index);
  }

  ngOnDestroy() {
    this.stopAllAlarms();
  }
}