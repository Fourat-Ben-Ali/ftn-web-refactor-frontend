import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthenticationService } from 'shared/services/authentication.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  userName: string = '';
  isOpen: boolean = true;

  model: MenuItem[] = [
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.logout();
      },
    },
  ];

  constructor(private auth: AuthenticationService) {}
  ngOnInit(): void {
    this.getUsername();
  }

  openSideBar() {
    this.toggleSidebar.emit();
  }

  /**
   * Get username
   * */
  getUsername() {
    this.userName = this.auth.getUsername();
  }

  /**
   * open and close user menu
   * */
  toggleUserMenu() {
    this.isOpen = !this.isOpen;
  }

  /**
   * logout
   * */
  logout() {
    this.auth.logout();
  }
}
