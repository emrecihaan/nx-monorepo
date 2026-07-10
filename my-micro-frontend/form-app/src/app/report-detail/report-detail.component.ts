import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatagridForFormatComponent } from '@my-micro-frontend/shared-ui';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FormService, GridTranslateService, GeneralSystemService } from '@my-micro-frontend/shared-core';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule, DatagridForFormatComponent, ButtonModule, DialogModule, PaginatorModule, FormsModule, SelectModule, ToastModule],
  providers: [MessageService],
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {
  @ViewChild('gridRef') gridRef!: DatagridForFormatComponent;
  data: any[] = [];
  column: any[] = [];
  selectedRow: any = null;
  customizeGrid: any;
  selectedRows: any[] = [];

  travelList: any[] = [];
  displaySelectedExpensesDialog: boolean = false;
  travel: any;

  user: any = null;
  displayTravelDialog: boolean = false;
  selectedTravel: any = null;
  travelsForDialog: any[] = [];

  first: number = 0;
  rows: number = 4;

  get paginatedTravelList(): any[] {
    return this.travelList.slice(this.first, this.first + this.rows);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  selectedExpenses: any[] = [];
  selectedTotalAmount: number = 0;

  updateSelectedExpenses() {
    if (!this.selectedRows) {
      this.selectedExpenses = [];
    } else {
      this.selectedExpenses = this.selectedRows.map((key: any) =>
        typeof key === 'object' ? key : this.data.find(d => d.id === key)
      ).filter((d: any) => d !== undefined);
    }
    this.selectedTotalAmount = this.selectedExpenses.reduce((sum, row) => sum + (Number(row.fiyat) || 0), 0);
  }

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

  constructor(
    private formService: FormService,
    private gridTranslate: GridTranslateService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private generalService: GeneralSystemService
  ) {
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
    this.getUser();
    if (history.state && history.state.travel) {
      this.travel = history.state.travel;
      const trFormId = this.travel.id !== undefined ? this.travel.id : this.travel.value;
      this.loadReportData(trFormId);
    }

    this.loadUnlinkedForms();
  }

  getUser() {
    this.generalService.getUserRedis().subscribe((res: any) => {
      if (res.code !== "99") {
        this.user = res.response;
      }
    });
  }

  loadUnlinkedForms() {
    this.formService.getUnlinkedFormsByFormId().subscribe((res: any) => {
      if (res.code != "99" && res.response) {
        this.travelList = res.response.map((item: any) => {
          let parsed;
          try {
            parsed = JSON.parse(item.formValues);
          } catch(e) {
            parsed = {};
          }
          const formValues = Array.isArray(parsed) ? parsed[0] : parsed;
          
          let formattedDate = "";
          if (item.createdDate) {
            const dateObj = new Date(item.createdDate);
            formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}.${dateObj.getFullYear()}`;
          } else if (formValues && formValues.date) {
            formattedDate = formValues.date;
          }
          
          const labelText = formValues?.expenseDescription || item.description || 'Masraf Formu';

          return {
            label: `Masraf No: ${item.id} - ${labelText}`,
            value: item.id,
            id: item.id,
            dateRange: formattedDate,
            reqNo: item.id?.toString(),
            description: labelText
          };
        });
        
        setTimeout(() => this.cdr.detectChanges(), 0);
      }
    });
  }

  loadReportData(trFormId: number) {
    this.formService.getReportByFormLinkTrFormId(trFormId).subscribe((res: any) => {
      if (res.code != "99") {
        if (res.response.length == 0) {
          // No records found, set empty data
          setTimeout(() => {
            this.data = [];
            this.column = [];
            this.cdr.detectChanges();
          }, 0);
          return;
        }

        const addedColumns = new Set<string>();
        const tempColumns: any[] = [];
        const tempData: any[] = [];

        res.response.forEach((field: any) => {
          const parsed = JSON.parse(field.formValues);
          const formValues = Array.isArray(parsed) ? parsed[0] : parsed;
          formValues.id = field.id;
          formValues.dfFormStatusId = field.dfFormStatusId;
          formValues.isActive = field.isActive !== undefined ? field.isActive : (field.dfForm ? field.dfForm.isActive : null);
          formValues.fiyat = formValues.fiyat || field.grossAmount || field.totalAmount;

          let jId = field.journeyId !== undefined ? field.journeyId : (formValues.journeyId !== undefined ? formValues.journeyId : null);
          formValues.journeyId = (jId === null || jId === '') ? 999999999 : jId;

          Object.keys(formValues).forEach(key => {
            if (!addedColumns.has(key)) {
              const columnDef: any = {
                dataField: key,
                caption: key === 'journeyId' ? 'Seyahat No' : key.charAt(0).toUpperCase() + key.slice(1)
              };
              if (key === 'journeyId') {
                columnDef.groupIndex = 0;
              }

              tempColumns.push(columnDef);
              addedColumns.add(key);
            }
          });
          tempData.push(formValues);
        });

        setTimeout(() => {
          this.gridTranslate.traslateColumns("reportColumns", tempColumns);
          this.column = tempColumns;
          this.data = tempData;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  setSelectedRow(selected: any) {
    this.selectedRow = selected;
  }

  setSelectedRows(selected: any[]) {
    this.selectedRows = selected;
    setTimeout(() => {
      this.updateSelectedExpenses();
      this.cdr.detectChanges();
    }, 0);
  }

  travelAssignment() {
    if (this.selectedRows && this.selectedRows.length > 0) {
      if (this.user && this.user.id) {
        this.formService.getFormListByDfFormIdAndUserId(10004, this.user.id).subscribe((res: any) => {
          if (res.code != "99") {
            this.travelsForDialog = res.response.map((item: any) => {
              let formattedDate = "";
              if (item.createdDate) {
                const dateObj = new Date(item.createdDate);
                formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}.${dateObj.getFullYear()}`;
              }
              return {
                label: `Talep No: ${item.id} - Tarih: ${formattedDate}`,
                value: item.id,
                id: item.id,
                dateRange: formattedDate,
                reqNo: item.id.toString(),
                description: item.description || 'Seyahat Formu'
              };
            });
            this.selectedTravel = null;
            this.displayTravelDialog = true;
            this.cdr.detectChanges();
          }
        });
      } else {
        this.selectedTravel = null;
        this.displayTravelDialog = true;
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Uyarı',
        detail: 'Lütfen en az bir masraf fişi seçiniz.'
      });
    }
  }

  associateTravel() {
    if (!this.selectedTravel) {
      this.messageService.add({
        severity: 'error',
        summary: 'Hata',
        detail: 'Lütfen ilişkilendirmek için bir seyahat seçin.'
      });
      return;
    }

    const expenseReceiptIds = this.selectedRows.map(row => {
      return typeof row === 'object' ? row.id : row;
    });

    const model = {
      expenseReceiptIds: expenseReceiptIds,
      newTrFormId: this.selectedTravel.value,
      type: 1
    };

    this.formService.updateOrRemoveTrFormLink(model).subscribe({
      next: (res: any) => {
        if (res.code === "200") {
          this.messageService.add({
            severity: 'success',
            summary: 'Başarılı',
            detail: `${this.selectedRows.length} adet masraf, ${this.selectedTravel.label} ile ilişkilendirildi.`
          });
          this.displayTravelDialog = false;
          this.selectedRows = [];
          this.updateSelectedExpenses();
          if (this.travel) {
            const trFormId = this.travel.id !== undefined ? this.travel.id : this.travel.value;
            this.loadReportData(trFormId);
          }
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Uyarı',
            detail: res.message || "İlişkilendirme işlemi sırasında bir uyarı oluştu."
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'İşlem sırasında bir hata oluştu.'
        });
      }
    });
  }
}
