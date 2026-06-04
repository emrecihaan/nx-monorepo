import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CompanyService, ExpenseGroupService, FormService } from '@my-micro-frontend/shared-core';

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
  selector: 'app-expense-center',
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
  templateUrl: './expense-center.component.html',
  styleUrl: './expense-center.component.scss'
})
export class ExpenseCenterComponent implements OnInit {

  expenseCenterForm!: FormGroup;
  formSubmitted = false;
  Data: any = [];
  companyList: any = [];
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
    this.getAllCostCenter();
  }

  private formService = inject(FormService);

  ngOnInit(): void {
    this.expenseCenterForm = this.fb.group({
      kostl: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      company: [null, Validators.required],
      text: ['', Validators.required],
      status: [null, Validators.required]
    });
    this.initializeColumns();
  }


  initializeColumns() {
    this.columns = [
      { dataField: 'kostl', caption: 'KOSTL', dataType: 'string', allowEditing: true },
      { dataField: 'text', caption: 'Masraf Yeri Adı', dataType: 'string', allowEditing: true },
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

  getAllCostCenter() {
    this.formService.getAllCostCenter().subscribe((res: any) => {
      console.log(res);
      if (res.code != "99") {
        this.Data = res.response;
      }
    });
  }


  onSubmit() {
    this.formSubmitted = true;
    if (this.expenseCenterForm.invalid) return;
    const formValue = this.expenseCenterForm.value;
    var model = {
      siteId: "0",
      id: 0,
      kostl: formValue.kostl,
      startDate: this.datepipe.transform(formValue.startDate, 'yyyy-MM-dd'),
      endDate: this.datepipe.transform(formValue.endDate, 'yyyy-MM-dd'),
      dfSystemCompanyId: formValue.company,
      text: formValue.text,
      status: formValue.status
    }
    this.formService.saveOrUpdateCostCenter(model).subscribe((res: any) => {
      console.log(res);
      if (res.code != "99") {
        this.getAllCostCenter();
        this.expenseCenterForm.reset();
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
          detail: this.translateService.instant('expenseCenterForm.endDateBeforeStartDate')
        });
        return;
      }
    }

    const model = {
      siteId: "0",
      id: updatedRow.id,
      kostl: updatedRow.kostl,
      text: updatedRow.text,
      startDate: this.datepipe.transform(updatedRow.startDate, 'yyyy-MM-dd'),
      endDate: this.datepipe.transform(updatedRow.endDate, 'yyyy-MM-dd'),
      dfSystemCompanyId: updatedRow.dfSystemCompanyId,
      status: updatedRow.status
    };

    this.formService.saveOrUpdateCostCenter(model).subscribe((res: any) => {
      console.log(res);
      if (res.code != "99") {
        this.getAllCostCenter();
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
