import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'; // Ready for your Node.js backend

// Defining the interface here (or you can import it from your guard.model.ts)
export interface Guard {
  id: string | number;
  name: string;
  mobile: string;
  gate: string;
}

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  // 1. Setup Mock Data (Matching your screenshot)
  private initialGuards: Guard[] = [
    { id: 1, name: 'Raj Kumar', mobile: '+91 98765 43210', gate: 'Gate 1' },
    { id: 2, name: 'Suresh Selvam', mobile: '+91 99887 76655', gate: 'Gate 2' }
  ];

  // 2. Create a reactive stream (BehaviorSubject) holding the guards array
  private guardsSubject = new BehaviorSubject<Guard[]>(this.initialGuards);
  
  // Expose the stream as an Observable so components can subscribe to it
  public guards$ = this.guardsSubject.asObservable();

  // Uncomment this when you are ready to connect to your Node.js API
  // private apiUrl = 'http://localhost:3000/api/guards';
  // constructor(private http: HttpClient) { }
  
  constructor() { }

  /**
   * Fetch all guards (Reactive)
   */
  getGuards(): Observable<Guard[]> {
    return this.guards$;
    
    // BACKEND INTEGRATION READY:
    // return this.http.get<Guard[]>(this.apiUrl);
  }

  /**
   * Add a new guard to the system
   */
  addGuard(newGuard: Omit<Guard, 'id'>) {
    // Generate a random ID for the demo
    const guardWithId: Guard = {
      ...newGuard,
      id: Math.random().toString(36).substr(2, 9)
    };

    const currentGuards = this.guardsSubject.getValue();
    this.guardsSubject.next([...currentGuards, guardWithId]);

    // BACKEND INTEGRATION READY:
    // return this.http.post<Guard>(this.apiUrl, newGuard).subscribe(res => {
    //   this.guardsSubject.next([...currentGuards, res]);
    // });
  }

  /**
   * Update an existing guard's assignment
   */
  updateGuard(updatedGuard: Guard) {
    const currentGuards = this.guardsSubject.getValue();
    const index = currentGuards.findIndex(g => g.id === updatedGuard.id);
    
    if (index !== -1) {
      currentGuards[index] = updatedGuard;
      this.guardsSubject.next([...currentGuards]);
    }

    // BACKEND INTEGRATION READY:
    // return this.http.put<Guard>(`${this.apiUrl}/${updatedGuard.id}`, updatedGuard).subscribe();
  }

  /**
   * Remove a guard from the system
   */
  deleteGuard(guardId: string | number) {
    const currentGuards = this.guardsSubject.getValue();
    const filteredGuards = currentGuards.filter(g => g.id !== guardId);
    
    this.guardsSubject.next(filteredGuards);

    // BACKEND INTEGRATION READY:
    // return this.http.delete(`${this.apiUrl}/${guardId}`).subscribe();
  }
}