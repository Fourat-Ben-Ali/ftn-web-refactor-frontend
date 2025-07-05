import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-front-office',
  templateUrl: './front-office.component.html',
  styleUrls: ['./front-office.component.scss']
})
export class FrontOfficeComponent implements OnInit {
  menuItems: MenuItem[] = [];
  isLoggedIn = false;
  isAuthPage = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    
    // Listen to route changes to detect auth pages
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAuthPage = event.url.includes('/login') || event.url.includes('/register');
    });
    
    // Check initial route
    this.isAuthPage = this.router.url.includes('/login') || this.router.url.includes('/register');
    
    if (this.isLoggedIn) {
      this.menuItems = [
        {
          label: 'Athletes',
          icon: 'pi pi-users',
          routerLink: ['/front-office/athletes']
        },
        {
          label: 'Clubs',
          icon: 'pi pi-building',
          routerLink: ['/front-office/clubs']
        },
         {
         label: 'Actualité Académique',
         icon: 'pi pi-book',
        routerLink: ['/front-office/actualite-academique']
         },
        {
          label: 'Programme Formation',
          icon: 'pi pi-calendar',
          routerLink: ['/front-office/programme-formation']
        },
        {
          label: 'Pool Reservations',
          icon: 'pi pi-calendar-plus',
          routerLink: ['/front-office/pool-reservations']
        },
        {
          label: 'Événements',
          icon: 'pi pi-calendar',
          routerLink: ['/front-office/evenements']
        },
        {
          label: 'Account',
          icon: 'pi pi-user',
          items: [
            {
              label: 'Logout',
              icon: 'pi pi-sign-out',
              command: () => this.logout()
            }
          ]
        }
      ];
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/front-office/login']);
  }
} 