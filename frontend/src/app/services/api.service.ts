import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  // This is your Python FastAPI backend URL
  private apiUrl = 'http://localhost:8000/api/guards';

  // This helps our Guard List auto-refresh when we add a new guard!
  private guardsUpdated = new BehaviorSubject<boolean>(true);
  guardsUpdated$ = this.guardsUpdated.asObservable();

  constructor(private http: HttpClient) { }

  // 🔒 MAGIC FUNCTION: Gets your unique account email securely from browser
  private getUserEmail(): string {
    return localStorage.getItem('userEmail') || '';
  }

  // --- ACCOUNT BASED APIs ---

  // 1. Get all guards from MongoDB (ONLY FOR THIS USER)
  getGuards(): Observable<any> {
    const email = this.getUserEmail();
    // Attaching user_email to the URL fixes the 422 Error!
    return this.http.get(`${this.apiUrl}?user_email=${email}`);
  }

  // 2. Send a new guard to MongoDB
  addGuard(guardData: any): Observable<any> {
    // Safety check: Attach email if it's missing in the data
    if (!guardData.user_email) {
      guardData.user_email = this.getUserEmail();
    }
    return this.http.post(this.apiUrl, guardData);
  }

  // 3. Delete a guard
  deleteGuard(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // 4. Tell the app to refresh the table
  notifyGuardsUpdated() {
    this.guardsUpdated.next(true);
  }
}