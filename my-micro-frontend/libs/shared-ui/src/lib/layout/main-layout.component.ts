import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastComponent } from '../toast/toast.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TokenService, BreadcrumbService, AppSelectionService, GeneralSystemService } from '@my-micro-frontend/shared-core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../loading/loading.component';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-main-layout',
  standalone: true,
  imports: [RouterModule, MenuComponent, TranslateModule, ToastComponent, ButtonModule, TooltipModule, BreadcrumbModule, CommonModule, LoadingComponent, SelectModule, FormsModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit, AfterViewInit {
  currentLang = 'tr';
  sidebarVisible = true;
  sidebarCollapsed = false;
  isDarkTheme = false;
  breadcrumbItems: any[] = [];
  user: any = null;

  languages = [
    { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
    { code: 'en', flag: '🇬🇧', name: 'English' },
    { code: 'es', flag: '🇪🇸', name: 'Español' }
  ];
  selectedLang = this.languages[0];

  constructor(
    private translate: TranslateService,
    private tokenService: TokenService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    public appSelectionService: AppSelectionService,
    private generalService: GeneralSystemService
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

  ngOnInit() {
    this.generalService.getUserRedis().subscribe((res: any) => {
      if (res.code !== "99") {
        this.user = res.response;
      }
    });
  }

  ngAfterViewInit() {
    this.initGoogleTranslate();
  }

  private initGoogleTranslate() {
    const initFn = () => {
      const el = document.getElementById('google_translate_element');
      if (el && (window as any).google && (window as any).google.translate) {
        el.innerHTML = ''; // Clear previous instances
        new (window as any).google.translate.TranslateElement({
          pageLanguage: 'tr',
          includedLanguages: 'tr,en,es',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');

        // Aygıt çerezini oku ve mevcut dili seçili göster
        this.syncLanguageSelection();
      }
    };

    if (!window.document.getElementById('google-translate-script')) {
      (window as any).googleTranslateElementInit = initFn;

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    } else {
      setTimeout(initFn, 300);
    }
  }

  syncLanguageSelection() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
    if (cookie) {
      const val = cookie.split('=')[1]; // e.g. /tr/en
      const code = val.split('/')[2];
      const found = this.languages.find(l => l.code === code);
      if (found) this.selectedLang = found;
    }
  }

  onLanguageChange(event: any) {
    const langCode = event.value ? event.value.code : event;
    
    // Google Translate için cookie ayarlıyoruz
    // Format: googtrans=/orijinal_dil/hedef_dil
    const cookieString = `/tr/${langCode === 'tr' ? 'tr' : langCode}`;
    
    // Hem kök domain hem de path için çerezleri ayarlıyoruz
    document.cookie = `googtrans=${cookieString}; path=/`;
    document.cookie = `googtrans=${cookieString}; path=/; domain=${location.hostname}`;
    
    // Sayfayı yenileyerek çevirinin kusursuz uygulanmasını sağlıyoruz
    window.location.reload();
  }

  updateBreadcrumbs() {
    const url = this.router.url;
    const excludedSegments = ['app', 'form-app', 'user-app', 'workflow-app'];
    const pathSegments = url.split('/').filter(p => p && !excludedSegments.includes(p));

    const items: any[] = [];

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      let label = segment;

      // Özel birleşik rotaları kontrol et (Örn: dynamic-form/10004)
      if (segment === 'dynamic-form' && (pathSegments[i + 1] === '1004' || pathSegments[i + 1] === '10004')) {
        items.push({ label: 'Seyahat Talep Formu' });
        i++; // 1004 veya 10004 kısmını atla
        continue;
      }

      if (segment === 'formapproverruledetail') {
        items.push({ label: 'Onay Kuralı Detay' });
        // ID parametresini (ör: 50010) breadcrumb'a eklememek için atla
        if (i + 1 < pathSegments.length) {
          i++;
        }
        continue;
      }

      if (segment === 'report') label = 'Masraf Raporu Oluştur';
      else if (segment === 'workflow-form') label = 'Talep Listesi';
      else if (segment === 'dynamic-form') label = 'Dinamik Form';
      else if (segment === 'dashboard') label = 'Taleplerim';
      else if (segment === 'expense-group') label = 'Masraf Grubu';
      else if (segment === 'admin-dashboard') label = 'Onay Bekleyen Talepler';
      else if (segment === 'organization') label = 'Organizasyon';
      else if (segment === 'budgetrule') label = 'Bütçe Kuralı';
      else if (segment === 'expense-type') label = 'Masraf Türü';
      else if (segment === 'cost-rule') label = 'Masraf Kuralı';
      else if (segment === 'parameter-type') label = 'Parametre Tipi';
      else if (segment === 'expense-center') label = 'Masraf Yeri';
      else if (segment === 'expense-request') label = 'Masraf ERP Aktarım';
      else if (segment === 'form-approver-rule') label = 'Onaycı Kuralları';
      else if (segment === 'formapproverrule') label = 'Onay Kural Yapısı';
      else if (segment === 'budgetreportuser' || segment === 'budgetreportorganization') {
        const translated = this.translate.instant('budgetReport.title');
        label = translated !== 'budgetReport.title' ? translated : 'Bütçe Organizasyon Raporu';
      }
      else {
        label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      }

      items.push({ label: label });
    }

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
