import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin.component';
import { TableModule } from 'primeng/table';
import { ClubsComponent } from './clubs/clubs.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [HomeComponent, AdminComponent, ClubsComponent],
  imports: [CommonModule, AdminRoutingModule, SharedModule, TableModule],
})
export class AdminModule {}
