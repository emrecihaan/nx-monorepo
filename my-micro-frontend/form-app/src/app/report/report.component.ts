import { Component, OnInit, Output, EventEmitter, inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormService, GeneralSystemService, GridTranslateService } from '@my-micro-frontend/shared-core';
import { DatagridForFormatComponent } from '@my-micro-frontend/shared-ui';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    ButtonModule,
    SelectModule,
    DialogModule,
    ToastModule,
    FloatLabelModule,
    InputTextModule,
    DatagridForFormatComponent,
    AccordionModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  @ViewChild('gridRef') gridRef!: DatagridForFormatComponent;
  data: any[] = [];
  column: any[] = [];
  selectedRow: any = null;
  customizeGrid: any;
  selectedRows: any[] = [];
  reportPeriod = [{
    value: "1",
    label: "1. Dönem"
  }]
  selectedIdsJson: any;
  displayTravelDialog: boolean = false;
  displaySelectedExpensesDialog: boolean = false;
  travelList: any[] = [];
  selectedTravel: any = null;

  get selectedExpenses(): any[] {
    if (!this.selectedRows) return [];
    return this.selectedRows.map((key: any) =>
      typeof key === 'object' ? key : this.data.find(d => d.id === key)
    ).filter((d: any) => d !== undefined);
  }

  selectedAmounts = 0;
  oldAmounts = 0;

  get selectedTotalAmount(): number {
    if (!this.selectedExpenses) return 0;
    return this.selectedExpenses.reduce((sum, row) => sum + (Number(row.fiyat) || 0), 0);
  }
  amountRule = 0;
  difference = false;
  formList: any[] = [];
  selectedForm: any = null;
  parameterList: any[] = [];
  selectedParameter: any = null;
  periodList: any[] = [];
  selectedPeriod: any = null;
  currencyList: any[] = [];
  selectedCurrency: any = null;
  user: any = null;
  formListALL: any[] = [];
  overAmount = 0;
  periodListAll: any;

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
    public formService: FormService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private translateService: TranslateService,
    public gridTranslate: GridTranslateService,
    private cdr: ChangeDetectorRef,
    public generalService: GeneralSystemService,
    private confirmationService: ConfirmationService) {
    this.getUser();

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
    setTimeout(() => {
      const lang = localStorage.getItem('languageKey');
      if (lang) {
        this.translateService.setDefaultLang(lang);
        this.translateService.use(lang);
      }
    }, 1000);
    const today = new Date();
    const todayStr =
      today.getFullYear() + '-' +
      (today.getMonth() + 1).toString().padStart(2, '0') + '-' +
      today.getDate().toString().padStart(2, '0');
    this.formService.getReportByFormId(1, todayStr).subscribe((res) => {
      if (res.code != "99") {
        const addedColumns = new Set<string>();
        const tempColumns: any[] = [];
        const tempData: any[] = [];
        res.response.forEach((field: any, index: number) => {
          const parsed = JSON.parse(field.formValues);
          const formValues = Array.isArray(parsed) ? parsed[0] : parsed;
          formValues.id = field.id || index;
          formValues.dfFormStatusId = field.dfFormStatusId;
          formValues.isActive = field.isActive !== undefined ? field.isActive : (field.dfForm ? field.dfForm.isActive : null);
          formValues.fiyat = formValues.fiyat || field.grossAmount || field.totalAmount;
          Object.keys(formValues).forEach(key => {
            if (!addedColumns.has(key)) {
              tempColumns.push({
                dataField: key,
                caption: key.charAt(0).toUpperCase() + key.slice(1)
              });
              addedColumns.add(key);
            }
          });
          tempData.push(formValues);
        });
        this.gridTranslate.traslateColumns("reportColumns", tempColumns);
        this.column = tempColumns;
        this.data = tempData;
        this.cdr.detectChanges();
      }
    })
    this.getFormList();
  }

  createReport() {
    if (this.selectedRows == null || this.selectedRows.length == 0) {
      return this.messageService.add({ severity: 'warn', summary: 'Hata', detail: "Lütfen en az bir kayıt seçiniz!" });
    }
    if (this.selectedForm == null) {
      return this.messageService.add({ severity: 'warn', summary: 'Hata', detail: "Lütfen Form seçiniz!" });
    }
    const selectedDataObjects = this.selectedRows.map((key: any) =>
      typeof key === 'object' ? key : this.data.find(d => d.id === key)
    ).filter((d: any) => d !== undefined);
    this.selectedAmounts = selectedDataObjects.reduce((total: any, item: any) => total + (item.amount || 0), 0);
    this.getBudgetRules();
  }

  updateField() {
    if (!this.selectedRows || this.selectedRows.length !== 1) {
      return this.messageService.add({ severity: 'warn', summary: 'Hata', detail: "Lütfen güncellemek için tek bir kayıt seçiniz!" });
    }
    const selectedKey = this.selectedRows[0];
    const selected = typeof selectedKey === 'object' ? selectedKey : this.data.find(d => d.id === selectedKey);
    if (selected) {
      this.router.navigate(['app/form-app/dynamic-form/0', selected.id]);
    }
  }

  deleteField() {
    if (!this.selectedRows || this.selectedRows.length === 0) {
      return this.messageService.add({ severity: 'warn', summary: 'Hata', detail: "Lütfen silmek için kayıt seçiniz!" });
    }
    if (this.selectedRows.length > 1) {
      return this.messageService.add({ severity: 'warn', summary: 'Uyarı', detail: "Lütfen silmek için sadece tek bir kayıt seçiniz!" });
    }
    const selectedKey = this.selectedRows[0];
    const selected = typeof selectedKey === 'object' ? selectedKey : this.data.find(d => d.id === selectedKey);
    if (selected) {
      this.confirmationService.confirm({
        message: 'Seçili kaydı silmek istediğinize emin misiniz?',
        header: 'Silme Onayı',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Evet',
        rejectLabel: 'Hayır',
        acceptButtonStyleClass: 'p-button-danger',
        accept: () => {
          const model = {
            Id: selected.id
          };
          this.formService.deleteTrForm(model).subscribe((res: any) => {
            if (res.code != "99") {
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant("success"),
                detail: this.translateService.instant("Kayıt Başarıyla Silindi")
              });
              this.searchReports();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant("error"),
                detail: this.translateService.instant(res.errorCode?.toString() || "99")
              });
            }
          });
        }
      });
    }
  }

  setSelectedRow(selected: any) {
    this.selectedRow = selected;
  }

  setSelectedRows(selected: any[]) {
    this.selectedRows = selected;
  }

  getBudgetRules() {
    let difference = false;
    const formDetail = this.formListALL.find(f => f.id === this.selectedForm.id);
    const selectedDataObjects = this.selectedRows.map((key: any) =>
      typeof key === 'object' ? key : this.data.find(d => d.id === key)
    ).filter((d: any) => d !== undefined);
    if (formDetail && formDetail.isBudgetControl == true) {
      this.formService.getUserBudgetRule(this.user?.id || 1, this.selectedForm.id).subscribe((res: any) => {
        if (res.code != "99") {
          if (!res.response || res.response.length === 0) {
            this.router.navigate(['app/form-app/dynamic-form', this.selectedForm.id], {
              state: { selectedRows: selectedDataObjects, overAmount: this.overAmount }
            });
            return;
          }
          for (const element of res.response) {
            this.amountRule = element.limitAmount;
            this.getConsumptionAmount(this.selectedForm.id, element.startDate, element.endDate);
            if (this.selectedAmounts + this.oldAmounts > this.amountRule) {
              this.difference = true;
              difference = true;
              this.messageService.add({ severity: 'error', summary: this.translateService.instant("error"), detail: "Seçilen kalemlerin toplam tutarı eski tüketim tutarı ile birlikte bütçe kuralını aşıyor!" });
            }
            else {
              if (this.difference == false) {
                this.router.navigate(['app/form-app/dynamic-form', this.selectedForm.id], {
                  state: { selectedRows: selectedDataObjects, overAmount: this.overAmount }
                });
              }
            }
          }
        }
      });
    }
    else {
      this.router.navigate(['app/form-app/dynamic-form', this.selectedForm.id], {
        state: { selectedRows: selectedDataObjects, overAmount: this.overAmount }
      });
    }
  }

  getConsumptionAmount(statusId: any, startDate: any, endDate: any) {
    this.formService.getUserConsumptionAmount(this.user?.id || 1, this.selectedForm.id, statusId, startDate, endDate).subscribe((res: any) => {
      if (res.code != "99") {
        this.oldAmounts = res.response;
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(value);
  }

  getFormList() {
    this.formService.getAllDfFormByIsBuggetControl().subscribe((res: any) => {
      if (res.code != "99") {
        this.formListALL = res.response;
        this.formList = res.response.map((form: any) => {
          return ({
            name: form.description,
            id: form.id
          })
        });
      }
    });
  }

  getDFormParameterValueList(dfFormId: any, code: string) {
    if (code == "PERIOD") {
      this.formService.getFormParameterValueListByDfFormId(dfFormId, code).subscribe((res: any) => {
        if (res.code != "99") {
          this.periodListAll = res.response;
          this.periodList = res.response.map((f: any) => {
            return ({
              name: f.displayName,
              id: f.id
            })
          })
        }
      });
    }

    if (code == "CURRENCY") {
      this.formService.getFormParameterValueListByDfFormId(dfFormId, code).subscribe((res: any) => {
        if (res.code != "99") {
          this.currencyList = res.response.map((f: any) => {
            return ({
              name: f.displayName,
              id: f.id
            })
          })
        }
      });
    }
  }

  changeSelectedForm(newValue: any) {
    this.selectedForm = newValue.value;
    if (this.selectedForm) {
      this.getDFormParameterValueList(this.selectedForm.id, "PERIOD");
      this.getDFormParameterValueList(this.selectedForm.id, "CURRENCY");
    }
  }

  getUser() {
    return this.generalService.getUserRedis().subscribe(async (res: any) => {
      if (res.code !== "99") {
        this.user = res.response;
      }
    });
  }

  createBill() {
    if (this.selectedForm != null) {
      const formDetail = this.formListALL.find(f => f.id == this.selectedForm.id);
      let date = null;
      if (this.selectedPeriod == null) {
        return this.messageService.add({ severity: 'warn', summary: 'Hata', detail: "Lütfen dönem seçiniz!" });
      }
      if (this.selectedPeriod.id != null) {
        const periodItem = this.periodListAll.find((p: any) => p.id == this.selectedPeriod.id);
        let value = periodItem?.value;
        if (!value && periodItem?.displayName) {
          const monthMap: any = { 'Ocak': '01', 'Şubat': '02', 'Mart': '03', 'Nisan': '04', 'Mayıs': '05', 'Haziran': '06', 'Temmuz': '07', 'Ağustos': '08', 'Eylül': '09', 'Ekim': '10', 'Kasım': '11', 'Aralık': '12' };
          const mStr = monthMap[periodItem.displayName];
          if (mStr) value = `${new Date().getFullYear()}-${mStr}-01`;
        }

        if (value) {
          const parts = value.split('-');
          const y = Number(parts[0]);
          const m = Number(parts[1]);
          const d = parts.length > 2 ? Number(parts[2]) : 1;
          date = new Date(y, m - 1, d);
          this.router.navigate(['app/form-app/dynamic-form', formDetail.reportedLineFormId], {
            state: { reportedDate: date }
          });
        }
      }
      else {
        return this.messageService.add({ severity: 'warn', summary: 'Hata', detail: "Lütfen dönem seçiniz!" });
      }
    }
    else {
      return this.messageService.add({ severity: 'warn', summary: 'Hata', detail: "Lütfen form seçiniz!" });
    }
  }

  searchReports() {
    if (this.selectedForm != null) {
      const formDetail = this.formListALL.find(f => f.id == this.selectedForm.id);
      this.data = [];
      this.column = [];
      let date = null;
      if (this.selectedPeriod && this.selectedPeriod.id != null) {
        const periodItem = this.periodListAll.find((p: any) => p.id == this.selectedPeriod.id);
        let value = periodItem?.value;
        if (!value && periodItem?.displayName) {
          const monthMap: any = { 'Ocak': '01', 'Şubat': '02', 'Mart': '03', 'Nisan': '04', 'Mayıs': '05', 'Haziran': '06', 'Temmuz': '07', 'Ağustos': '08', 'Eylül': '09', 'Ekim': '10', 'Kasım': '11', 'Aralık': '12' };
          const mStr = monthMap[periodItem.displayName];
          if (mStr) value = `${new Date().getFullYear()}-${mStr}-01`;
        }

        if (value) {
          const parts = value.split('-');
          const y = Number(parts[0]);
          const m = Number(parts[1]);
          const d = parts.length > 2 ? Number(parts[2]) : 1;
          date = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
        }
      }

      this.formService.getReportByFormId(formDetail.reportedLineFormId, date).subscribe((res: any) => {
        if (res.code != "99") {
          if (res.response.length == 0) {
            return this.messageService.add({
              severity: 'warn',
              summary: 'Hata',
              detail: "Seçtiğiniz kriterlere uygun rapor bulunamadı."
            });
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
          this.gridTranslate.traslateColumns("reportColumns", tempColumns);
          this.column = tempColumns;
          this.data = tempData;
          this.cdr.detectChanges();
        }
      })
    }
  }

  createdReport() {
    if (this.selectedForm) {
      const selectedDataObjects = this.selectedRows.map((key: any) =>
        typeof key === 'object' ? key : this.data.find(d => d.id === key)
      ).filter((d: any) => d !== undefined);
      this.router.navigate(['app/form-app/dynamic-form', this.selectedForm.id], {
        state: { selectedRows: selectedDataObjects, overAmount: this.overAmount }
      });
    }
  }

  travelAssignment() {
    if (this.selectedRows && this.selectedRows.length > 0) {
      if (this.user && this.user.id) {
        this.formService.getFormListByDfFormIdAndUserId(10004, this.user.id).subscribe((res: any) => {
          if (res.code != "99") {
            this.travelList = res.response.map((item: any) => {
              let formattedDate = "";
              if (item.createdDate) {
                const dateObj = new Date(item.createdDate);
                formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}.${(dateObj.getMonth() + 1).toString().padStart(2, '0')}.${dateObj.getFullYear()}`;
              }
              return {
                label: `Talep No: ${item.id} - Tarih: ${formattedDate}`,
                value: item.id,
                dateRange: formattedDate,
                reqNo: item.id.toString(),
                description: item.description || 'Seyahat Formu'
              };
            });
            this.selectedTravel = null;
            this.displayTravelDialog = true;
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

  isRemoveConnectionVisible = (e: any) => {
    return e.row.data.journeyId != null && e.row.data.journeyId != 999999999;
  };

  removeConnection(rowData: any) {
    this.confirmationService.confirm({
      message: 'Bağlantıyı silmek istediğinize emin misiniz?',
      header: 'Onay',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Evet',
      rejectLabel: 'Hayır',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        const model = {
          expenseReceiptIds: [rowData.id || rowData.expenseReceiptId || rowData.Id || 0],
          newTrFormId: 0,
          type: 1
        };
        this.formService.updateOrRemoveTrFormLink(model).subscribe({
          next: (res: any) => {
            if (res.code === "200") {
              this.messageService.add({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Bağlantı başarıyla kaldırıldı.'
              });
              rowData.journeyId = 999999999;
              if (this.gridRef && this.gridRef.dataGrid && this.gridRef.dataGrid.instance) {
                this.gridRef.dataGrid.instance.refresh();
              }
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Uyarı',
                detail: res.message || "Bağlantı kaldırılamadı."
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
    });
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
            detail: `${this.selectedRows.length} adet masraf, 
              ${this.selectedTravel.label} ile ilişkilendirildi.`
          });
          this.displayTravelDialog = false;
          this.selectedRows = [];
          this.searchReports();
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
          detail: `${this.selectedRows.length} adet masraf, 
              ${this.selectedTravel.label} ile ilişkilendirilemedi.`
        });
      }
    });
  }
}