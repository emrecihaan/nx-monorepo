import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CompanyService, ExpenseGroupService } from '@my-micro-frontend/shared-core';

// PrimeNG Modules
import { AccordionModule } from 'primeng/accordion';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatagridForFormatComponent } from '@my-micro-frontend/shared-ui';

@Component({
  selector: 'app-expense-group',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    TranslateModule,
    AccordionModule,
    InputTextModule,
    DatePickerModule,
    SelectModule,
    ButtonModule,
    PanelModule,
    ToastModule,
    FloatLabelModule,
    DatagridForFormatComponent
  ],
  providers: [MessageService, DatePipe],
  templateUrl: './expense-group.component.html',
  styleUrl: './expense-group.component.scss'
})

export class ExpenseGroupComponent {

  expenseGroupForm!: FormGroup;
  formSubmitted = false;
  Data: any = [];
  companyList = [];
  statusOptions = [
    { id: 1, name: 'Aktif' },
    { id: 2, name: 'Pasif' }
  ];
  selectedRow: any;
  recordId: number | null = 0;
  columns: any = [];


  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private expenseGroupService: ExpenseGroupService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private datepipe: DatePipe,
  ) {
    this.getAllCompanies();
    this.getAllCostGroup();
  }

  ngOnInit(): void {
    this.expenseGroupForm = this.fb.group({
      groupCode: ['', Validators.required],
      groupName: ['', Validators.required],
      dateRange: [null, [Validators.required, this.rangeRequired]],
      company: [null, Validators.required],
      status: [null, Validators.required]
    });
    this.initializeColumns();
  }

  rangeRequired(control: any) {
    if (control.value && Array.isArray(control.value)) {
      const [start, end] = control.value;
      return start && end ? null : { rangeIncomplete: true };
    }
    return { rangeIncomplete: true };
  }

  initializeColumns() {
    this.columns = [
      { dataField: 'grpKod', caption: 'Grup Kodu', dataType: 'string', allowEditing: true },
      { dataField: 'grpName', caption: 'Grup Adı', dataType: 'string', allowEditing: true },
      { dataField: 'startDate', caption: 'Başlangıç Tarihi', dataType: 'date', format: 'dd/MM/yyyy', allowEditing: true },
      { dataField: 'endDate', caption: 'Bitiş Tarihi', dataType: 'date', format: 'dd/MM/yyyy', allowEditing: true },
      {
        dataField: 'dfSystemCompanyId',
        caption: 'Şirket',
        dataType: 'number',
        allowEditing: true,
        lookup: {
          dataSource: this.companyList,
          displayExpr: 'name',
          valueExpr: 'id'
        }
      },
      {
        dataField: 'status',
        caption: 'Durum',
        dataType: 'number',
        allowEditing: true,
        lookup: {
          dataSource: this.statusOptions,
          displayExpr: 'name',
          valueExpr: 'id'
        }
      }
    ];
  }

  setSelectedRow(value: any) {
    this.selectedRow = value;
  }

  getAllCostGroup() {
    this.expenseGroupService.getAllCostGroup().subscribe((res: any) => {
      console.log(res);
      if (res.code != "99") {
        this.Data = res.response;
      }
    });
  }

  getAllCompanies() {
    this.companyService.getAllCompany().subscribe((res: any) => {
      console.log(res)
      if (res.code != "99") {
        this.companyList = res.response.map((company: any) => ({
          id: company.id,
          name: company.companyName
        }));
        this.initializeColumns();
      }
    })
  };

  callEdit(event: any) {
    this.selectedRow = event;
    this.expenseGroupForm.patchValue({
      groupCode: this.selectedRow.grpKod,
      groupName: this.selectedRow.grpName,
      dateRange: [new Date(this.selectedRow.startDate), new Date(this.selectedRow.endDate)],
      company: this.selectedRow.dfSystemCompanyId,
      status: this.selectedRow.status
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.expenseGroupForm.invalid) return;
    const formValue = this.expenseGroupForm.value;

    if (!formValue.dateRange || !formValue.dateRange[0] || !formValue.dateRange[1]) {
      this.messageService.add({
        severity: 'error',
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('expenseGroup.dateRangeReq')
      });
      return;
    }

    const [startDate, endDate] = formValue.dateRange;

    var model = {
      siteId: "0",
      id: 0,
      grpKod: formValue.groupCode,
      grpName: formValue.groupName,
      startDate: this.datepipe.transform(startDate, 'yyyy-MM-dd'),
      endDate: this.datepipe.transform(endDate, 'yyyy-MM-dd'),
      dfSystemCompanyId: formValue.company,
      status: formValue.status
    }
    this.expenseGroupService.saveOrUpdateCostGroup(model).subscribe((res: any) => {
      console.log(res);
      if (res.code != "99") {
        this.getAllCostGroup();
        this.expenseGroupForm.reset();
        this.formSubmitted = false;
        return this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordAddedSuccessfully')
        });
      } else {
        return this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('messageServiceMessages.recordCannotAdded')
        });
      }
    });
  }

  onRowUpdate(e: any) {
    e.cancel = true;

    const updatedRow = { ...e.oldData, ...e.newData };

    if (updatedRow.startDate && updatedRow.endDate) {
      const startDate = new Date(updatedRow.startDate);
      const endDate = new Date(updatedRow.endDate);

      if (endDate < startDate) {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('expenseGroup.endDateBeforeStartDate')
        });
        return;
      }
    }

    const model = {
      siteId: "0",
      id: updatedRow.id,
      grpKod: updatedRow.grpKod,
      grpName: updatedRow.grpName,
      startDate: this.datepipe.transform(updatedRow.startDate, 'yyyy-MM-dd'),
      endDate: this.datepipe.transform(updatedRow.endDate, 'yyyy-MM-dd'),
      dfSystemCompanyId: updatedRow.dfSystemCompanyId,
      status: updatedRow.status
    };

    this.expenseGroupService.saveOrUpdateCostGroup(model).subscribe((res: any) => {
      console.log(res);
      if (res.code != "99") {
        this.getAllCostGroup();
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant("success"),
          detail: 'Kayıt Güncellendi'
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant("error"),
          detail: 'Kayıt Güncellenemedi'
        });
      }
    });
  }
}