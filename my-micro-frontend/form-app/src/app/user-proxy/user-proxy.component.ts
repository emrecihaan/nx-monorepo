import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { FormService } from '@my-micro-frontend/shared-core';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-user-proxy',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    CardModule,
    ToastModule,
    SelectModule,
    AccordionModule
  ],
  templateUrl: './user-proxy.component.html',
  styleUrls: ['./user-proxy.component.scss']
})
export class UserProxyComponent implements OnInit {

  userProxyForm!: FormGroup;
  formSubmitted = false;
  Data: any[] = [];
  readonly statusOptions = [
    { id: 1, name: 'Aktif' },
    { id: 2, name: 'Beklemede' },
    { id: 0, name: 'Pasif' }
  ];
  columns: any[] = [];
  userList: any[] = [];
  selectedRow: any;

  constructor() { }

  private datePipe = inject(DatePipe);
  private formService = inject(FormService);
  private translateService = inject(TranslateService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
  }

  //#region Datagrid Options
  initializeColumns() {
    this.columns = [
      {
        dataField: 'ownerId',
        caption: 'Asıl Kullanıcı',
        lookup: {
          dataSource: this.userList,
          displayExpr: 'fullName',
          valueExpr: 'id'
        },
        validationRules: [{ type: 'required' }]
      },
      {
        dataField: 'proxyId',
        caption: 'Vekil Kullanıcı',
        lookup: {
          dataSource: this.userList,
          displayExpr: 'fullName',
          valueExpr: 'id'
        },
        validationRules: [{ type: 'required' }]
      },
      {
        dataField: 'startDate',
        caption: 'Başlangıç',
        dataType: 'date',
        format: 'dd/MM/yyyy'
      },
      {
        dataField: 'endDate',
        caption: 'Bitiş',
        dataType: 'date',
        format: 'dd/MM/yyyy'
      },
      {
        dataField: 'status',
        caption: 'Durum',
        lookup: {
          dataSource: this.statusOptions,
          displayExpr: 'name',
          valueExpr: 'id'
        }
      }
    ];
  }

  onRowUpdate(e: any) {
    e.cancel = true;
    const updated = { ...e.oldData, ...e.newData };
    const model = {
      id: updated.id,
      ownerId: updated.ownerId,
      proxyId: updated.proxyId,
      startDate: this.datePipe.transform(updated.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(updated.endDate, 'yyyy-MM-dd'),
      status: updated.status,
      siteId: "0"
    };

    this.formService.saveOrUpdateUserProxy(model).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Güncellendi', detail: 'Kayıt güncellendi' });
      this.getAllProxies();
    });
  }

  setSelectedRow(value: any) { this.selectedRow = value; }
  //#endregion
  //#region Post Methods
  onSubmit() {
    this.formSubmitted = true;
    if (this.userProxyForm.invalid) return;

    const val = this.userProxyForm.value;
    const model = {
      id: 0,
      ownerId: val.ownerUser,
      proxyId: val.proxyUser,
      startDate: this.datePipe.transform(val.startDate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(val.endDate, 'yyyy-MM-dd'),
      status: val.status,
      siteId: "0"
    };

    this.formService.saveOrUpdateUserProxy(model).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Kaydedildi' });
      this.userProxyForm.reset({ status: 1, startDate: new Date() });
      this.formSubmitted = false;
      this.getAllProxies();
    });
  }
  //#endregion

  //#region Get Methods
  getAllProxies() {
    this.formService.getAllUserProxy().subscribe((res: any) => {
      console.log(res);
      this.Data = res.response || res;
    });
  }
  //#endregion
}
