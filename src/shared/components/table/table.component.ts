import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageEvent } from 'models';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  
  @Input() columns: string[] = []; 
  @Input() rows: any[] = [];  
  @Input() totalRecords: number = 0;
  @Input() first: number = 0;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20];

  @Output() onPage = new EventEmitter<PageEvent>(); 

}
