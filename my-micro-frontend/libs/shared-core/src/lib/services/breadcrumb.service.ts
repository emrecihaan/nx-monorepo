import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbs = new BehaviorSubject<MenuItem[]>([]);
  breadcrumbs$ = this.breadcrumbs.asObservable();

  setBreadcrumbs(items: MenuItem[]) {
    this.breadcrumbs.next(items);
  }
}
