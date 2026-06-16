import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastComponent } from '../toast/toast.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TokenService, BreadcrumbService, AppSelectionService } from '@my-micro-frontend/shared-core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-main-layout',
  standalone: true,
  imports: [RouterModule, MenuComponent, TranslateModule, ToastComponent, ButtonModule, TooltipModule, BreadcrumbModule, CommonModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  currentLang = 'tr';
  sidebarVisible = true;
  sidebarCollapsed = false;
  isDarkTheme = false;
  breadcrumbItems: any[] = [];

  constructor(
    private translate: TranslateService,
    private tokenService: TokenService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    public appSelectionService: AppSelectionService
  ) {
    this.currentLang = this.translate.currentLang || 'tr';
    this.applyTheme();

    // Rota değişimlerini dinle
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBreadcrumbs();
    });

    this.breadcrumbService.breadcrumbs$.subscribe(items => {
      this.breadcrumbItems = items;
    });

    this.updateBreadcrumbs();
  }

  updateBreadcrumbs() {
    const url = this.router.url;
    const excludedSegments = ['app', 'form-app', 'user-app', 'workflow-app'];
    const pathSegments = url.split('/').filter(p => p && !excludedSegments.includes(p));

    const items = pathSegments.map((segment) => {
      let label = segment;

      if (segment === 'report') label = 'Masraf Raporu Oluştur';
      else if (segment === 'dynamic-form') label = 'Dinamik Form';
      else if (segment === 'dashboard') label = 'Kontrol Paneli';
      else if (segment === 'expense-group') label = 'Masraf Grubu';
      else if (segment === 'budgetrule') label = 'Bütçe Kuralı';
      else if (segment === 'expense-type') label = 'Masraf Türü';
      else if (segment === 'cost-rule') label = 'Masraf Kuralı';
      else if (segment === 'parameter-type') label = 'Parametre Kuralı';
      else if (segment === 'expense-center') label = 'Masraf Yeri';
      else if (segment === 'expense-request') label = 'Masraf ERP Aktarım';
      else if (segment === 'form-approver-rule') label = 'Onaycı Kuralları';

      else if (segment === 'budgetreportuser' || segment === 'budgetreportorganization') {
        const translated = this.translate.instant('budgetReport.title');
        label = translated !== 'budgetReport.title' ? translated : 'Bütçe Kullanıcı Raporu';
      }
      else {
        label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      }

      return { label: label };
    });

    // En başa her zaman "Anasayfa"yı ekliyoruz
    this.breadcrumbItems = [{ icon: 'pi pi-home', routerLink: '/app', label: ' Anasayfa' }, ...items];
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
  }

  private applyTheme() {
    const theme = this.isDarkTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }

  logout() {
    this.appSelectionService.setApp(null, null);
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }

  changeProject() {
    this.appSelectionService.setApp(null, null);
    this.router.navigate(['/app']);
  }
}
