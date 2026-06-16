import { Component, OnInit, Output, EventEmitter, inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormService, GeneralSystemService, GridTranslateService } from '@my-micro-frontend/shared-core';
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

  constructor(
    public formService: FormService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private translateService: TranslateService,
    public gridTranslate: GridTranslateService,
    private cdr: ChangeDetectorRef,
    public generalService: GeneralSystemService) {
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
    debugger;
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

    const selectedKey = this.selectedRows[0];
    const selected = typeof selectedKey === 'object' ? selectedKey : this.data.find(d => d.id === selectedKey);

    if (selected) {
      const model = {
        Id: selected.id
      };

      this.formService.deleteTrForm(model).subscribe((res: any) => {
        if (res.code != "99") {
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant("success"),
            detail: this.translateService.instant("success")
          });
          window.location.reload();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant("error"),
            detail: this.translateService.instant(res.errorCode?.toString() || "99")
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

    // Seçili anahtarlardan gerçek nesneleri bulalım
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
        const value = periodItem?.value;
        if (value) {
          const [y, m, d] = value.split('-').map(Number);
          date = new Date(Date.UTC(y, m - 1, d))
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
        const value = periodItem?.value;
        if (value) {
          const [y, m, d] = value.split('-').map(Number);
          date = new Date(Date.UTC(y, m - 1, d)).toISOString();
        }
      }

      this.formService.getReportByFormId(formDetail.reportedLineFormId, date).subscribe((res: any) => {
        if (res.code != "99") {
          const addedColumns = new Set<string>();
          const tempColumns: any[] = [];
          const tempData: any[] = [];

          res.response.forEach((field: any) => {
            const parsed = JSON.parse(field.formValues);
            const formValues = Array.isArray(parsed) ? parsed[0] : parsed;
            formValues.id = field.id;
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
}
