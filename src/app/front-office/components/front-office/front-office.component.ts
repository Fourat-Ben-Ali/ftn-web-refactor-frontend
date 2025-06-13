import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-front-office',
  template: `
    <div class="front-office-container">
      <div class="header">
        <h1>Swimming Federation</h1>
        <p-menu [model]="menuItems" [style]="{'width': '100%'}"></p-menu>
      </div>
      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .front-office-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .header {
      background-color: #ffffff;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      color: #2196F3;
      margin: 0 0 1rem 0;
      text-align: center;
    }
    .content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class FrontOfficeComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Athletes',
      icon: 'pi pi-users',
      routerLink: ['/front-office/athletes']
    },
    {
      label: 'Clubs',
      icon: 'pi pi-building',
      routerLink: ['/front-office/clubs']
    }
  ];
} 