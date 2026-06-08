import { Component, OnInit, Input, signal, ChangeDetectorRef, inject, effect } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageSubService, AppSelectionService } from '@my-micro-frontend/shared-core';
import { HttpClient } from '@angular/common/http';

export interface MenuItem {
  label: string;
  icon: string;
  routerLink: string[];
  styleClass?: string;
  items?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'lib-menu',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  @Input() collapsed = false;
  model: any[] = [];

  private router = inject(Router);
  private pageSubService = inject(PageSubService);
  private translate = inject(TranslateService);
  private cdr = inject(ChangeDetectorRef);
  private http = inject(HttpClient);
  private appSelectionService = inject(AppSelectionService);

  constructor() {
    this.getStaticMenu();
    this.getPages();
    this.translate.onLangChange.subscribe(() => {
      this.translateStaticMenu();
      this.getPages();
    });
    effect(() => {
      const selected = this.appSelectionService.selectedApp();
      this.updateMenuItems();
    });
  }

  protected sidebarCollapsed = signal(false);
  ngOnInit(): void { }


  private rawStaticMenuItems: MenuItem[] = [];
  private staticMenuItems: MenuItem[] = [];

  protected menuItems: MenuItem[] = [];

  getStaticMenu() {
    this.http.get<MenuItem[]>('assets/data/menu.json').subscribe((res) => {
      this.rawStaticMenuItems = res;
      this.translateStaticMenu();
    });
  }

  translateStaticMenu() {
    this.staticMenuItems = this.rawStaticMenuItems.map(item => ({
      ...item,
      label: this.translate.instant(item.label)
    }));
    this.updateMenuItems();
  }

  updateMenuItems() {
    const selectedApp = this.appSelectionService.selectedApp();
    let filteredModel = this.model;
    
    if (selectedApp) {
      const routePrefix = selectedApp === 'workflowApp' ? '/app/workflow-app' : '/app/form-app';
      const routesToApp = (link?: string[]) => link && link.length > 0 && link[0].startsWith(routePrefix);

      filteredModel = this.model.map((item: any) => {
        // Kopyasını oluştur ki orijinal model bozulmasın
        const newItem = { ...item };
        // Eğer alt menüleri varsa, onları da kendi içinde filtrele
        if (newItem.items) {
          newItem.items = newItem.items.filter((sub: any) => routesToApp(sub.routerLink));
        }
        return newItem;
      }).filter((item: any) => {
        // Ana menü direkt eşleşiyorsa veya altında eşleşen alt menü kaldıysa göster
        if (routesToApp(item.routerLink)) return true;
        if (item.items && item.items.length > 0) return true;
        return false;
      });
    }

    this.menuItems = [...this.staticMenuItems, ...filteredModel];
    this.cdr.detectChanges();
  }

  getAppPrefixForUrl(url: string | undefined): string {
    if (!url) return '/app';
    const urlLower = url.toLowerCase();
    
    const formAppPaths = [
      'dynamic-form', 'report', 'expense-reports', 'expense-group', 'cost-rule',
      'costrulefilter', 'parametertype', 'expense-center', 'user-proxy', 'notfound'
    ];
    if (formAppPaths.some(p => urlLower.includes(p))) {
      return '/app/form-app';
    }

    const workflowAppPaths = [
      'workflow-form', 'admin-dashboard', 'organization', 'formapproverrule',
      'formapproverruledetail', 'budgetrule', 'budgetreportorganization',
      'expense-request', 'budgetreportuser'
    ];
    if (workflowAppPaths.some(p => urlLower.includes(p))) {
      return '/app/workflow-app';
    }
    
    return '/app';
  }

  getPages() {
    return this.pageSubService.getPages().subscribe((res) => {
      console.log('Menu API Response:', res);
      const pages = Array.isArray(res) ? res : (res?.response || []);
      const modelList: MenuItem[] = [];
      if (pages.length > 0) {
        for (const page of pages) {
          let newPage: MenuItem;
          const translatedLabel = this.translate.instant(`${page.pageName}`);
          
          if (page.subPages && page.subPages.length > 0) {
            newPage = { label: translatedLabel, icon: page.icon, routerLink: ['/'], items: [] };
            for (const pageSub of page.subPages) {
              const translatedSubLabel = this.translate.instant(`${pageSub.subPageName}`);
              let finalUrl = pageSub.url;
              
              const prefix = this.getAppPrefixForUrl(finalUrl);
              if (finalUrl && !finalUrl.startsWith('/app')) {
                finalUrl = prefix + (finalUrl.startsWith('/') ? finalUrl : '/' + finalUrl);
              }
              
              const newSubPage: MenuItem = { label: translatedSubLabel, icon: pageSub.icon, routerLink: [finalUrl] };
              newPage.items?.push(newSubPage);
            }
          }
          else {
            let finalUrl = page.url || '/';
            const prefix = this.getAppPrefixForUrl(finalUrl);
            if (finalUrl && !finalUrl.startsWith('/app') && finalUrl !== '/') {
              finalUrl = prefix + (finalUrl.startsWith('/') ? finalUrl : '/' + finalUrl);
            }
            newPage = { label: translatedLabel, icon: page.icon, routerLink: [finalUrl] };
          }
          modelList.push(newPage);
        }
      }
      this.model = modelList;
      this.updateMenuItems();
    })
  }

  toggleSubMenu(item: MenuItem) {
    if (item.items && item.items.length > 0) {
      item.expanded = !item.expanded;
    } else {
      this.router.navigate(item.routerLink);
    }
  }
}