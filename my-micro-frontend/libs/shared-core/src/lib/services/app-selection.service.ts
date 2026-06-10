import { Injectable, signal } from '@angular/core';

export type AppType = 'workflowApp' | 'formApp' | null;

@Injectable({
  providedIn: 'root'
})
export class AppSelectionService {
  private selectedAppSignal = signal<AppType>(null);
  selectedApp = this.selectedAppSignal.asReadonly();

  private selectedProjectIdSignal = signal<string | null>(null);
  selectedProjectId = this.selectedProjectIdSignal.asReadonly();

  constructor() {
    try {
      const savedApp = localStorage.getItem('selectedApp') as AppType;
      const savedProjectId = localStorage.getItem('selectedProjectId');
      if (savedApp) {
        this.selectedAppSignal.set(savedApp);
      }
      if (savedProjectId) {
        this.selectedProjectIdSignal.set(savedProjectId);
      }
    } catch (e) {
      console.warn('LocalStorage is not available');
    }
  }

  setApp(app: AppType, projectId?: string | null) {
    this.selectedAppSignal.set(app);
    this.selectedProjectIdSignal.set(projectId || null);

    try {
      if (app) {
        localStorage.setItem('selectedApp', app);
      } else {
        localStorage.removeItem('selectedApp');
      }
      if (projectId) {
        localStorage.setItem('selectedProjectId', projectId);
      } else {
        localStorage.removeItem('selectedProjectId');
      }
    } catch (e) {
      console.warn('LocalStorage is not available');
    }
  }
}
