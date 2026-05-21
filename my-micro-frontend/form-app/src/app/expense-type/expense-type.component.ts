import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DatagridForFormatComponent } from '@my-micro-frontend/shared-ui';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { FormService } from '@my-micro-frontend/shared-core';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-expense-type',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    ButtonModule,
    CardModule,
    ToastModule,
    DatagridForFormatComponent,
    ToolbarModule,
    PanelModule,
    DialogModule,
    FloatLabelModule,
    InputTextModule,
    SelectModule,
    AccordionModule,
    ReactiveFormsModule 
  ],
  providers: [MessageService],
  templateUrl: './expense-type.component.html',
  styleUrls: ['./expense-type.component.scss']
})
export class ExpenseTypeComponent implements OnInit {

  formSubmitted = false;
  expenseTypeForm!: FormGroup;
  formTitle: string = "";
  selectedRow: any;
  columns: any = [];
  Data: any = [];
  companyList = [];
  statusOptions = [
    { id: 1, name: 'Aktif' },
    { id: 2, name: 'Pasif' }
  ];
  constructor() { }

  private formService = inject(FormService);
  private translateService = inject(TranslateService);
  private messageService = inject(MessageService);
  private datePipe = inject(DatePipe);

  ngOnInit(): void {
  }

  setSelectedRow(value: any) {
    this.selectedRow = value;
  }


  initializeColumns() {
    this.columns = [
      { dataField: 'kostv', caption: 'KOSTV', dataType: 'string', allowEditing: true },
      { dataField: 'text', caption: 'Masraf Türü Adı', dataType: 'string', allowEditing: true },
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

  onSubmit() {
    this.formSubmitted = true;
    if (this.expenseTypeForm.invalid) return;
    const formValue = this.expenseTypeForm.value;
    var model = {
      siteId: "0",
      id: 0,
      kostv: formValue.kostv,
      startDate: this.datePipe.transform(formValue.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(formValue.endDate, 'yyyy-MM-dd'),
      dfSystemCompanyId: formValue.company,
      text: formValue.text,
      status: formValue.status
    }
    this.formService.saveOrUpdateCostType(model).subscribe((res: any) => {
      console.log(res);
      if (res.code != "99") {
        this.getAllCostType();
        this.expenseTypeForm.reset();
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

  getAllCostType() {
    this.formService.getAllCostType().subscribe((res: any) => {
      console.log(res);
      if (res.code != "99") {
        this.Data = res.response;
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
          detail: this.translateService.instant('expenseTypeForm.endDateBeforeStartDate')
        });
        return;
      }
    }

    const model = {
      siteId: "0",
      id: updatedRow.id,
      kostv: updatedRow.kostv,
      text: updatedRow.text,
      startDate: this.datePipe.transform(updatedRow.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(updatedRow.endDate, 'yyyy-MM-dd'),
      dfSystemCompanyId: updatedRow.dfSystemCompanyId,
      status: updatedRow.status
    };

    this.formService.saveOrUpdateCostType(model).subscribe((res: any) => {
      console.log(res);
      if (res.code != "99") {
        this.getAllCostType();
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
