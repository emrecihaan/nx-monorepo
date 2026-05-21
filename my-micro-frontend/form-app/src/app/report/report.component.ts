import { Component, OnInit, Output, EventEmitter, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormService } from '@my-micro-frontend/shared-core';
import { DatagridForFormatComponent } from '@my-micro-frontend/shared-ui';
import { MessageService } from 'primeng/api';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

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
    DatagridForFormatComponent
  ],
  providers: [MessageService],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
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

  @Output() selectionChanged = new EventEmitter<any[]>();

  selectedAmounts = 0;
  oldAmounts = 0;
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

  private formService = inject(FormService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private translateService = inject(TranslateService);

  constructor() {
    this.getUser();
  }

  ngOnInit(): void {
    setTimeout(() => {
      const lang = localStorage.getItem('languageKey');
      if (lang) {
        this.translateService.setDefaultLang(lang);
        this.translateService.use(lang);
      }
    }, 1000);

    this.getFormList();

    this.customizeGrid = (columns: any[]) => {
       // Note: gridTranslate removed as it is absent in target project
       // Standard translations handled by datagrid component itself or via translateService
    }
  }

  createReport() {
    if (this.selectedRows == null || this.selectedRows.length == 0) {
      return this.messageService.add({ severity: 'warn', summary: 'Hata', detail: "Lütfen en az bir kayıt seçiniz!" });
    }

    if (this.selectedForm == null) {
      return this.messageService.add({ severity: 'warn', summary: 'Hata', detail: "Lütfen Form seçiniz!" });
    }
    this.selectedAmounts = this.selectedRows.reduce((total, item) => total + (item.amount || 0), 0);
    this.getBudgetRules();
  }

  updateField() {
    if (this.selectedRow == null) {
      return this.messageService.add({ severity: 'warn', summary: 'Hata', detail: "Lütfen en az bir kayıt seçiniz!" });
    }
    this.router.navigate(['/dynamic-form/0', this.selectedRow.id]);
  }

  deleteField() {
    if (this.selectedRow == null) {
      return this.messageService.add({ severity: 'warn', summary: 'Hata', detail: "Lütfen en az bir kayıt seçiniz!" });
    }
    const model = {
      Id: this.selectedRow.id
    }
    let counter = 0;

    if (this.selectedRows.length == 0) {
      this.formService.deleteTrForm(model).subscribe((res: any) => {
        if (res.code != "99") {
          this.messageService.add({ severity: 'success', summary: this.translateService.instant("success"), detail: this.translateService.instant("success") });
          window.location.reload();
        }
        else {
          return this.messageService.add({ severity: 'error', summary: this.translateService.instant("error"), detail: this.translateService.instant(res.errorCode.toString()) })
        }
      })
    }
    else {
      for (const element of this.selectedRows) {
        const deleteModel = { Id: element.id };
        counter = counter + 1;
        this.formService.deleteTrForm(deleteModel).subscribe((res: any) => {
          if (res.code != "99") {
            this.messageService.add({ severity: 'success', summary: this.translateService.instant("success"), detail: this.translateService.instant("success") });
          }
          else {
            this.messageService.add({ severity: 'error', summary: this.translateService.instant("error"), detail: this.translateService.instant(res.errorCode.toString()) })
          }
        });
        if (counter == this.selectedRows.length) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
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
    if (formDetail && formDetail.isBudgetControl == true) {
      this.formService.getUserBudgetRule(this.user?.id || 1, this.selectedForm.id).subscribe((res: any) => {
        if (res.code != "99") {
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
                this.router.navigate(['/dynamic-form', this.selectedForm.id], {
                  state: { selectedRows: this.selectedRows, overAmount: this.overAmount }
                });
              }
            }
          }
        }
      });
    }
    else {
      this.router.navigate(['/dynamic-form', this.selectedForm.id], {
        state: { selectedRows: this.selectedRows, overAmount: this.overAmount }
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
     // Note: GeneralSystemService removed as it is absent in target project. 
     // Defaulting to null or dummy if needed.
     this.user = { id: 1 }; 
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
        const value = periodItem?.value;
        if (value) {
            const [y, m, d] = value.split('-').map(Number);
            date = new Date(Date.UTC(y, m - 1, d))
            this.router.navigate(['/dynamic-form', formDetail.reportedLineFormId], {
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
        const value = periodItem?.value;
        if (value) {
            const [y, m, d] = value.split('-').map(Number);
            date = new Date(Date.UTC(y, m - 1, d)).toISOString();
        }
      }

      this.formService.getReportByFormId(formDetail.reportedLineFormId, date).subscribe((res: any) => {
        if (res.code != "99") {
          const addedColumns = new Set<string>();
          res.response.forEach((field: any) => {
            const parsed = JSON.parse(field.formValues);
            const formValues = Array.isArray(parsed) ? parsed[0] : parsed;
            formValues.id = field.id;
            Object.keys(formValues).forEach(key => {
              if (!addedColumns.has(key)) {
                this.column.push({
                  dataField: key,
                  caption: key.charAt(0).toUpperCase() + key.slice(1)
                });
                addedColumns.add(key);
              }
            });
            this.data.push(formValues);
          });
        }
      })
    }
  }

  createdReport() {
    if (this.selectedForm) {
      this.router.navigate(['/dynamic-form', this.selectedForm.id], {
        state: { selectedRows: this.selectedRows, overAmount: this.overAmount }
      });
    }
  }
}
