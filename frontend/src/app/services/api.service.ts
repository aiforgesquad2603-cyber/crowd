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

  // Get all guards from MongoDB
  getGuards(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Send a new guard to MongoDB
  addGuard(guardData: any): Observable<any> {
    return this.http.post(this.apiUrl, guardData);
  }

  // Delete a guard
  deleteGuard(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Tell the app to refresh the table
  notifyGuardsUpdated() {
    this.guardsUpdated.next(true);
  }
}