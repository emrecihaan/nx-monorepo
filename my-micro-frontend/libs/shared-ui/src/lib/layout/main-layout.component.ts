import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastComponent } from '../toast/toast.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { TokenService } from '@my-micro-frontend/shared-core';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-main-layout',
  standalone: true,
  imports: [RouterModule, MenuComponent, TranslateModule, ToastComponent, ButtonModule, TooltipModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  currentLang = 'en';
  sidebarVisible = true;
  sidebarCollapsed = false;
  isDarkTheme = false;

  constructor(
    private translate: TranslateService,
    private tokenService: TokenService,
    private router: Router
  ) {
    const savedLang = localStorage.getItem('languageKey') || 'en';
    this.translate.setDefaultLang(savedLang);
    this.translate.use(savedLang);
    this.currentLang = savedLang;
    this.applyTheme();
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
    localStorage.setItem('languageKey', lang);
    window.location.reload();
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
    this.tokenService.removeToken();
    this.router.navigate(['/login']);
  }
}
