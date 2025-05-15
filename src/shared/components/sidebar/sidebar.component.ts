import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { sideBarItems } from 'models';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() sidebarItems!: sideBarItems[];
  @Input() isExpanded: boolean = false;
  routeUrl: string;
  IMAGE_URL: string = 'assets/logos/main-logo.png';

  constructor(private router: Router) {
    this.routeUrl = router.url;
  }
}
