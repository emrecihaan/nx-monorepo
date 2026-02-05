import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'lib-toast',
    standalone: true,
    imports: [CommonModule],
    animations: [
        trigger('toastAnimation', [
            transition(':enter', [
                style({ transform: 'translateY(100%)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ],
    template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts()" 
           class="toast" 
           [ngClass]="toast.type"
           [@toastAnimation]>
        {{ toast.message }}
        <button (click)="toastService.remove(toast.id)" class="close-btn">×</button>
      </div>
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      min-width: 250px;
      padding: 15px 20px;
      border-radius: 4px;
      color: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .success { background-color: #28a745; }
    .error { background-color: #dc3545; }
    .info { background-color: #17a2b8; }
    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      margin-left: 10px;
    }
  `]
})
export class ToastComponent {
    constructor(public toastService: ToastService) { }
}
