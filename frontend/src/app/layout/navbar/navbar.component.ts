import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  // You can make this dynamic later based on actual backend data
  systemStatus: string = 'ALL SYSTEMS LIVE';
  activeMenu: string = 'Live Dashboard';

  constructor() { }

  ngOnInit(): void {
  }

  setActiveMenu(menu: string) {
    this.activeMenu = menu;
  }
}