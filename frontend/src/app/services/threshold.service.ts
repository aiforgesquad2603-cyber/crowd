import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Ready for your Node.js backend

export interface ThresholdSettings {
  crowdLimitPerGate: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class ThresholdService {

  // 1. Setup Initial State (Defaulting to 50 based on your screenshot's placeholder)
  private initialSettings: ThresholdSettings = {
    crowdLimitPerGate: 50 
  };

  // 2. Create a reactive stream (BehaviorSubject) holding the threshold data
  private thresholdSubject = new BehaviorSubject<ThresholdSettings>(this.initialSettings);
  
  // Expose the stream as an Observable so components can subscribe to it
  public threshold$ = this.thresholdSubject.asObservable();

  // Uncomment this when you are ready to connect to your Node.js API
  // private apiUrl = 'http://localhost:3000/api/thresholds';
  // constructor(private http: HttpClient) { }

  constructor() { }

  /**
   * Fetch the current threshold settings (Reactive)
   */
  getThresholds(): Observable<ThresholdSettings> {
    return this.threshold$;

    // BACKEND INTEGRATION READY:
    // return this.http.get<ThresholdSettings>(this.apiUrl);
  }

  /**
   * Get the current value instantly without subscribing (useful for one-off checks)
   */
  getCurrentLimit(): number | null {
    return this.thresholdSubject.getValue().crowdLimitPerGate;
  }

  /**
   * Update the system threshold limit
   */
  updateThreshold(newLimit: number) {
    const updatedSettings: ThresholdSettings = {
      crowdLimitPerGate: newLimit
    };

    // Broadcast the new limit to all subscribed components
    this.thresholdSubject.next(updatedSettings);

    // BACKEND INTEGRATION READY:
    // return this.http.put<ThresholdSettings>(this.apiUrl, updatedSettings).subscribe(
    //   res => console.log('Threshold saved to database:', res),
    //   err => console.error('Failed to save threshold:', err)
    // );
  }
}