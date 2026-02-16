import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-guard-list',
  templateUrl: './guard-list.component.html',
  styleUrls: ['./guard-list.component.css']
})
export class GuardListComponent implements OnInit {

  @Output() editGuard = new EventEmitter<any>();
  guards: any[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // This automatically fetches data when the page loads OR when a new guard is registered
    this.apiService.guardsUpdated$.subscribe(() => {
      this.loadGuards();
    });
  }

  loadGuards() {
    this.apiService.getGuards().subscribe({
      next: (data) => {
        this.guards = data; // Put the database data into your table!
      },
      error: (err) => console.error("Could not load guards", err)
    });
  }

  onEdit(guard: any) {
    this.editGuard.emit(guard);
  }

  onDelete(guard: any) {
    if(confirm(`Are you sure you want to delete ${guard.name}?`)) {
      this.apiService.deleteGuard(guard.id).subscribe(() => {
        this.loadGuards(); // Refresh table after deleting
      });
    }
  }
}