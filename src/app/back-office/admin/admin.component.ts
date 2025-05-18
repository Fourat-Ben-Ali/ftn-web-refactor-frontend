import { Component } from '@angular/core';
import { sideBarItems } from 'models';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  isSideBarExpanded = true;

  sideBarItems: sideBarItems[] = [
    { item: 'Dashboard', path: 'home', icon: 'pi pi-chart-bar', role: 'admin' },
    { item: 'Clubs', path: 'clubs', icon: 'pi pi-building', role: 'admin' },
  ];

  breadcrumbItems = [{ label: 'Admin', icon: 'pi pi-user', path: '' }];

  toggleSideBar() {
    this.isSideBarExpanded = !this.isSideBarExpanded;
  }
}
