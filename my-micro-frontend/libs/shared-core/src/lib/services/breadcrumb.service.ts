import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadcrumbs = new BehaviorSubject<MenuItem[]>([]);
  breadcrumbs$ = this.breadcrumbs.asObservable();

  private itemsSource = new Subject<MenuItem[]>();

  itemsHandler = this.itemsSource.asObservable();

  setBreadcrumbs(items: MenuItem[]) {
    this.breadcrumbs.next(items);
  }
  setItems(items: MenuItem[]) {
    this.itemsSource.next(items);
  }
}
