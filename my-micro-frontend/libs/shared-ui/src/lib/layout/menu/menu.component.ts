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

  private lastFetchedProjectId: string | null | undefined = undefined;

  private lastPagesResponse: any = null;

  constructor() {
    this.getStaticMenu();

    this.translate.onLangChange.subscribe(() => {
      this.translateStaticMenu();
      if (this.lastPagesResponse) {
        this.processPagesResponse(this.lastPagesResponse);
      }
    });

    effect(() => {
      const selected = this.appSelectionService.selectedApp();
      const projectId = this.appSelectionService.selectedProjectId();
      
      if (this.lastFetchedProjectId !== projectId) {
        this.lastFetchedProjectId = projectId;
        this.loadPages(projectId);
      } else {
        this.updateMenuItems();
      }
    });
  }

  loadPages(projectId?: string | null) {
    if (projectId) {
      this.pageSubService.getSubPagesByProjectId(projectId).subscribe((res) => {
        this.processPagesResponse(res);
      });
    } else {
      this.getPages();
    }
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
    this.menuItems = [...this.staticMenuItems, ...this.model];
    this.cdr.detectChanges();
  }


  getPages() {
    return this.pageSubService.getPages().subscribe((res) => {
      this.processPagesResponse(res);
    });
  }

  processPagesResponse(res: any) {
    console.log('Menu API Response:', res);
    this.lastPagesResponse = res;
    
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
            let finalUrl = pageSub.url || '';

            if (finalUrl && !finalUrl.startsWith('/app/')) {
              finalUrl = finalUrl.startsWith('/') ? `/app${finalUrl}` : `/app/${finalUrl}`;
            }

            const newSubPage: MenuItem = { label: translatedSubLabel, icon: pageSub.icon, routerLink: [finalUrl] };
            newPage.items?.push(newSubPage);
          }
        }
        else {
          let finalUrl = page.url || '/';
          if (finalUrl !== '/' && !finalUrl.startsWith('/app/')) {
            finalUrl = finalUrl.startsWith('/') ? `/app${finalUrl}` : `/app/${finalUrl}`;
          }
          newPage = { label: translatedLabel, icon: page.icon, routerLink: [finalUrl] };
        }
        modelList.push(newPage);
      }
    }
    this.model = modelList;
    this.updateMenuItems();
  }

  toggleSubMenu(item: MenuItem) {
    if (item.items && item.items.length > 0) {
      item.expanded = !item.expanded;
    } else {
      this.router.navigate(item.routerLink);
    }
  }
}