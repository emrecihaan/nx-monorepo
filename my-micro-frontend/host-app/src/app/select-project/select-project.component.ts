import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppSelectionService, GeneralSystemService, TokenService } from '@my-micro-frontend/shared-core';

@Component({
  selector: 'app-select-project',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-project.component.html',
  styleUrl: './select-project.component.scss'
})
export class SelectProjectComponent implements OnInit {
  public appSelectionService = inject(AppSelectionService);
  private router = inject(Router);
  private systemService = inject(GeneralSystemService);
  private tokenService = inject(TokenService);
  private cdr = inject(ChangeDetectorRef);

  applications: any[] = [];
  selectedApplication: any = null;
  loadingProjects: boolean = false;

  ngOnInit() {
    // Sayfa açıldığında önceden kalmış proje seçimini ve menüyü sıfırla
    this.appSelectionService.setApp(null, null);
    this.loadProjects();
  }

  loadProjects() {
    const userId = this.tokenService.getUserId();
    this.loadingProjects = true;
    this.systemService.getPageCategoryByUserId(userId).subscribe({
      next: (res: any) => {
        this.loadingProjects = false;
        if (res && (res.code === '200' || res.code === 200)) {
          this.applications = res.response || [];
        } else {
          this.applications = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadingProjects = false;
        console.error('Uygulamalar yüklenemedi:', err);
        this.cdr.detectChanges();
      }
    });
  }

  selectApplication(app: any) {
    if (this.selectedApplication === app) {
      this.selectedApplication = null;
    } else {
      this.selectedApplication = app;
    }
  }

  selectCategory(app: any, category: any) {
    const appType = app.applicationId === 1002 ? 'formApp' : 'workflowApp';
    const projectId = category.pageCategoryId;
    this.appSelectionService.setApp(appType, projectId);
    this.router.navigate(['/app/dashboard']);
  }
}
