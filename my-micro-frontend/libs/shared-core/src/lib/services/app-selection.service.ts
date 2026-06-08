import { Injectable, signal } from '@angular/core';

export type AppType = 'workflowApp' | 'formApp' | null;

@Injectable({
  providedIn: 'root'
})
export class AppSelectionService {
  private selectedAppSignal = signal<AppType>(null);
  selectedApp = this.selectedAppSignal.asReadonly();

  setApp(app: AppType) {
    this.selectedAppSignal.set(app);
  }
}
