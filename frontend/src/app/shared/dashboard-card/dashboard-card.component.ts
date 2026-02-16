import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css']
})
export class DashboardCardComponent implements OnInit {

  @Input() title: string = 'Metric Title';
  @Input() value: string | number = '0';
  @Input() statusLabel: string = 'STATUS';
  @Input() iconPath: string = ''; // We will pass the SVG path d="..." here
  
  // Accepts 'teal', 'orange', 'red', or 'blue'
  @Input() theme: 'teal' | 'orange' | 'red' | 'blue' = 'teal'; 
  @Input() animatePulse: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  // Tailwind requires explicit class names to compile correctly. 
  // This helper maps the theme string to the correct Tailwind classes.
  getThemeClasses() {
    const themes = {
      teal: {
        border: 'border-teal-500',
        text: 'text-teal-400',
        badgeBg: 'bg-teal-900/50',
        badgeBorder: 'border-teal-800'
      },
      orange: {
        border: 'border-orange-500',
        text: 'text-orange-400',
        badgeBg: 'bg-orange-900/50',
        badgeBorder: 'border-orange-800'
      },
      red: {
        border: 'border-red-500',
        text: 'text-red-400',
        badgeBg: 'bg-red-900/50',
        badgeBorder: 'border-red-800'
      },
      blue: {
        border: 'border-blue-500',
        text: 'text-blue-400',
        badgeBg: 'bg-blue-900/50',
        badgeBorder: 'border-blue-800'
      }
    };
    return themes[this.theme];
  }
}