import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'shared-ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [style.backgroundColor]="color" class="custom-btn">
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .custom-btn { 
      padding: 12px 24px; 
      color: white; 
      border: none; 
      border-radius: 6px; 
      cursor: pointer;
      font-weight: bold;
    }
  `]
})
export class ButtonComponent {
  @Input() color = '#007bff';
}