import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {


  @Output() toggleSidebar = new EventEmitter<void>();

  openSideBar() {
    this.toggleSidebar.emit(); 
  }

}
