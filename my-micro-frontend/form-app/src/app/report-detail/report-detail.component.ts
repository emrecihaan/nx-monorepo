import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatagridForFormatComponent } from '@my-micro-frontend/shared-ui';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule, DatagridForFormatComponent],
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {
  data: any[] = [];
  column: any[] = [];
  selectedRow: any = null;
  customizeGrid: any;
  selectedRows: any[] = [];

  expenseTypeCellTemplate(container: any, options: any) {
    const value = options.value ? options.value.trim() : '';
    let svgIcon = '';
    let badgeClass = '';

    switch (value) {
      case 'Konaklama':
        svgIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>`;
        badgeClass = 'badge-konaklama';
        break;
      case 'Ulaşım':
        svgIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3m10 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0m-7 0a2 2 0 1 1-4 0m4 0a2 2 0 1 0-4 0"/></svg>`;
        badgeClass = 'badge-ulasim';
        break;
      case 'Yemek':
        svgIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`;
        badgeClass = 'badge-yemek';
        break;
      case 'Diğer':
        svgIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/></svg>`;
        badgeClass = 'badge-diger';
        break;
      default:
        svgIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
        badgeClass = 'badge-default';
        break;
    }

    const div = document.createElement('div');
    div.className = `expense-badge ${badgeClass}`;
    div.innerHTML = `<span class="badge-icon">${svgIcon}</span><span class="badge-text">${value}</span>`;
    container.appendChild(div);
  }

  statusCellTemplate(container: any, options: any) {
    const statusId = Number(options.value);
    let text = '';
    let badgeClass = '';

    switch (statusId) {
      case 1:
        text = 'Düzeltme Bekleyen';
        badgeClass = 'status-duzeltme';
        break;
      case 2:
        text = 'Onay Bekleyen';
        badgeClass = 'status-onay';
        break;
      case 3:
        text = 'Onaylanan';
        badgeClass = 'status-onaylanan';
        break;
      case 4:
        text = 'Reddedilen';
        badgeClass = 'status-reddedilen';
        break;
      default:
        text = options.value || 'Bilinmiyor';
        badgeClass = 'status-default';
        break;
    }

    const div = document.createElement('div');
    div.className = `status-badge ${badgeClass}`;
    div.innerText = text;
    container.appendChild(div);
  }

  activeCellTemplate(container: any, options: any) {
    const isActive = options.value;
    const text = isActive ? 'Aktif' : 'Pasif';
    const badgeClass = isActive ? 'status-aktif' : 'status-pasif';

    const div = document.createElement('div');
    div.className = `status-badge ${badgeClass}`;
    div.innerText = text;
    container.appendChild(div);
  }

  constructor() {
    this.customizeGrid = (columns: any[]) => {
      const orderedColumns = [
        'id',
        'date',
        'expenseDescription',
        'expenseType',
        'fiyat',
        'dfFormStatusId',
        'isActive'
      ];

      columns.forEach(col => {
        const index = orderedColumns.indexOf(col.dataField);
        if (index > -1) {
          col.visibleIndex = index;
        }

        if (col.dataField === 'expenseType') {
          col.cellTemplate = this.expenseTypeCellTemplate.bind(this);
        }
        if (col.dataField === 'dfFormStatusId') {
          col.caption = 'Durum';
          col.cellTemplate = this.statusCellTemplate.bind(this);
        }
        if (col.dataField === 'isActive') {
          col.caption = 'Durum ';
          col.cellTemplate = this.activeCellTemplate.bind(this);
        }
        if (col.dataField === 'fiyat' || col.dataField === 'grossAmount' || col.dataField === 'totalAmount') {
          col.caption = 'Tutar';
        }
        if (col.dataField === 'fisDetay') {
          col.visible = false;
        }
        if (col.dataField === 'date') {
          col.dataType = 'date';
          col.format = 'dd.MM.yyyy';
        }

        col.alignment = 'left';
      });
    };
  }

  ngOnInit(): void {
    this.column = [
      { dataField: 'id', caption: 'Id' },
      { dataField: 'date', caption: 'Tarih' },
      { dataField: 'expenseDescription', caption: 'Açıklama' },
      { dataField: 'expenseType', caption: 'Masraf Tipi' },
      { dataField: 'fiyat', caption: 'Tutar' },
      { dataField: 'dfFormStatusId', caption: 'Durum' },
      { dataField: 'isActive', caption: 'Aktif' }
    ];

    this.data = [
      { id: 1, date: '2026-05-10', expenseDescription: 'Ankara Ziyareti Otel', expenseType: 'Konaklama', fiyat: 2500.0, dfFormStatusId: 3, isActive: true },
      { id: 2, date: '2026-05-11', expenseDescription: 'Ankara Ziyareti Uçak', expenseType: 'Ulaşım', fiyat: 1500.5, dfFormStatusId: 2, isActive: true },
      { id: 3, date: '2026-05-12', expenseDescription: 'Ankara Ziyareti Yemek', expenseType: 'Yemek', fiyat: 450.75, dfFormStatusId: 1, isActive: true },
      { id: 4, date: '2026-05-13', expenseDescription: 'Kırtasiye', expenseType: 'Diğer', fiyat: 120.0, dfFormStatusId: 4, isActive: false }
    ];
  }

  setSelectedRow(selected: any) {
    this.selectedRow = selected;
  }

  setSelectedRows(selected: any[]) {
    this.selectedRows = selected;
  }
}
