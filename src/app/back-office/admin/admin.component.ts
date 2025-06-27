import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthenticationService } from '../../../shared/services/authentication.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {
  items: MenuItem[] = [];
  home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
  isSideBarExpanded = true;

  sideBarItems = [
    { item: 'Dashboard', path: 'home', icon: 'pi pi-chart-bar', role: 'admin' },
    { item: 'Clubs', path: 'clubs', icon: 'pi pi-building', role: 'admin' },
    { item: 'Athletes', path: 'athletes', icon: 'pi pi-users', role: 'admin' },
    {
      item: 'Disciplines',
      path: 'disciplines',
      icon: 'pi pi-list',
      role: 'admin',
    },
    {
      item: 'National Teams',
      path: 'equipe-nationale',
      icon: 'pi pi-flag',
      role: 'admin',
    },
    {
      item: 'Licenses',
      path: 'licences',
      icon: 'pi pi-id-card',
      role: 'admin',
    },
    {
      item: 'Academy News',
      path: 'actualite-academie',
      icon: 'pi pi-bell',
      role: 'admin',
    },
    {
      item: 'Training Programs',
      path: 'programme-formation',
      icon: 'pi pi-calendar',
      role: 'admin',
    },
    {
      item: 'Events',
      path: 'evenements',
      icon: 'pi pi-calendar',
      role: 'admin',
    },
    { item: 'Press', path: 'presse', icon: 'pi pi-id-card', role: 'admin' },
    { item: 'Pool Reservations', path: 'pool-reservations', icon: 'pi pi-calendar-plus', role: 'admin' }
  ];

  breadcrumbItems = [{ label: 'Admin', icon: 'pi pi-user', path: '' }];

  constructor(private authService: AuthenticationService) {}

  toggleSideBar() {
    this.isSideBarExpanded = !this.isSideBarExpanded;
  }

  logout() {
    this.authService.logout();
  }
}
