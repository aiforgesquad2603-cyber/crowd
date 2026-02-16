import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-glass-card',
  templateUrl: './glass-card.component.html',
  styleUrls: ['./glass-card.component.css']
})
export class GlassCardComponent implements OnInit {

  // Allows you to pass extra utility classes from the parent component
  // Example: <app-glass-card customClasses="p-8 mt-4">
  @Input() customClasses: string = 'p-6'; 

  constructor() { }

  ngOnInit(): void {
  }

}