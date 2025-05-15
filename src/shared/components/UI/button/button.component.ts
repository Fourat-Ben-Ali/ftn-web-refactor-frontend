import { Component ,Input ,Output , EventEmitter} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Output() clicked  = new EventEmitter();
  @Input() label ?: string = 'Button';
  @Input() icon?: string;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() severity?: 'primary' | 'danger' | 'info' | 'secondary' | 'warning' ='primary' ;
  @Input() disabled: boolean = false;
  @Input() className: string = '';
  @Input() isLoading: boolean=false;
  @Input() rounded: boolean = false;
  @Input() pTooltip?: string='';



  emitClick() {
    this.clicked.emit();
  }

}
