import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormService, GridTranslateService } from '@my-micro-frontend/shared-core';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DatagridForFormatComponent } from '@my-micro-frontend/shared-ui';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-erp-expense-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccordionModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    DatagridForFormatComponent,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './erp-expense-request.component.html',
  styleUrls: ['./erp-expense-request.component.scss']
})

export class ErpExpenseRequestComponent implements OnInit {
  data = [];
  customizeGrid: any;
  column = [
    {
      dataField: "id",
      caption: "ID",
      alignment: "left"
    },
    {
      dataField: "status",
      caption: "Durum",
      alignment: "left"
    },
    {
      dataField: "activity",
      caption: "Aktivite",
      alignment: "left"
    },
    {
      dataField: "year",
      caption: "Yıl",
      alignment: "left"
    },
    {
      dataField: "month",
      caption: "Ay",
      alignment: "left"
    },
    {
      dataField: "amount",
      caption: "Tutar",
      alignment: "left"
    },
    {
      dataField: "amountExcludingVat",
      caption: "KdvHariç",
      alignment: "left"
    },
    {
      dataField: "budgetOverrun",
      caption: "Bütçe Aşım",
      alignment: "left"
    },
    {
      dataField: "requestOwner",
      caption: "Talep Sahibi",
      alignment: "left"
    },
    {
      dataField: "personnelCode",
      caption: "Personel Kodu",
      alignment: "left"
    },
    {
      dataField: "paymentType",
      caption: "Ödeme Türü",
      alignment: "left"
    },
    {
      dataField: "odk",
      caption: "Ödk",
      alignment: "left"
    },
    {
      dataField: "ledger",
      caption: "Kebir",
      alignment: "left"
    },
    {
      dataField: "requestHandler",
      caption: "Talep Kimde",
      alignment: "left"
    },
    {
      dataField: "evaluation",
      caption: "Değerlendirme",
      alignment: "left"
    },
    {
      dataField: "transferInfo",
      caption: "Aktarım Bilgisi",
      alignment: "left"
    }
  ];
  detailColumn = [
    {
      dataField: "id",
      caption: "ID",
      alignment: "left"
    },
    {
      dataField: "expenseType",
      caption: "Harcama Türü",
      alignment: "left"
    },
    {
      dataField: "date",
      caption: "Tarih",
      dataType: "date",
      alignment: "left"
    },
    {
      dataField: "amount",
      caption: "Tutar",
      alignment: "left"
    },
    {
      dataField: "expenseDescription",
      caption: "Açıklama",
      alignment: "left"
    },
    {
      dataField: "department",
      caption: "Departman",
      alignment: "left"
    },
    {
      dataField: "project",
      caption: "Proje",
      alignment: "left"
    },
    {
      dataField: "file",
      caption: "Dosya",
      alignment: "left"
    }
  ];
  selectedRows: any[] = [];
  detailHeader: string = "Masraf Talebi Detayları";
  yearOptions = [
    { label: '2020', value: 2020 },
    { label: '2021', value: 2021 },
    { label: '2022', value: 2022 },
    { label: '2023', value: 2023 },
    { label: '2024', value: 2024 },
    { label: '2025', value: 2025 },
    { label: '2026', value: 2026 },
    { label: '2027', value: 2027 },
    { label: '2028', value: 2028 },
    { label: '2029', value: 2029 },
    { label: '2030', value: 2030 }
  ];
  monthOptions = [
    { label: 'Ocak', value: 1 },
    { label: 'Şubat', value: 2 },
    { label: 'Mart', value: 3 },
    { label: 'Nisan', value: 4 },
    { label: 'Mayıs', value: 5 },
    { label: 'Haziran', value: 6 },
    { label: 'Temmuz', value: 7 },
    { label: 'Ağustos', value: 8 },
    { label: 'Eylül', value: 9 },
    { label: 'Ekim', value: 10 },
    { label: 'Kasım', value: 11 },
    { label: 'Aralık', value: 12 }
  ];
  filterForm: any;
  statusOptions = [
    { label: 'Yeni', value: 1 },
    { label: 'Onay Bekliyor', value: 2 },
    { label: 'Onaylandı', value: 3 },
    { label: 'Reddedildi', value: 4 }
  ];
  constructor(
    public formService: FormService,
    public gridTranslate: GridTranslateService,
    private router: Router,
    private fb: FormBuilder,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      formOwner: [null],
      formStatus: [null],
      periodYear: [null],
      periodMonth: [null],
      sapDate: [null]
    });
    setTimeout(() => {
      this.customizeGrid = (columns: any[]) => {
        this.gridTranslate.traslateColumns("expenseRequestColumns", columns);
      }
    }, 1000);
    this.getData();
  }

  getData() {
    const formValues = this.filterForm.value;
    const model = {
      FormOwner: formValues.formOwner,
      FormStatus: formValues.formStatus != null ? formValues.formStatus.toString() : null,
      PeriodYear: formValues.periodYear,
      PeriodMonth: formValues.periodMonth,
      SapDocumentDate: formValues.sapDate ? new Date(formValues.sapDate).toISOString() : null
    };

    this.formService.getExpenseRequestForms(model).subscribe((res: any) => {
      if (res.code != "99") {
        this.data = res.response;
      }
    })
  }

  callShow(event: any) {
    this.router.navigate(['/dynamic-form', 0, event.id]).then(success => {
      if (!success) {
        this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'İlgili form detay sayfasına ulaşılamıyor.' });
      }
    }).catch(err => {
      this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'İlgili form detay sayfasına ulaşılamıyor.' });
      console.error('Navigation error:', err);
    });
  }

  setSelectedRows(value: any) {
    this.selectedRows = value;
  }

  sendSAP() {
    if (!this.selectedRows || this.selectedRows.length === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Uyarı', detail: 'Lütfen en az bir kayıt seçiniz.' });
      return;
    }

    this.formService.createExpenseRequestSAP(this.selectedRows).subscribe((res: any) => {
      if (res.code != "99") {
        this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Talepler SAP\'a başarıyla aktarıldı.' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'İşlem sırasında bir hata oluştu.' });
      }
    });
  }

  underConstruction() {
    this.messageService.add({ severity: 'info', summary: 'Bilgi', detail: 'Bu özellik henüz yapım aşamasındadır.' });
  }

  onClear() {
    this.filterForm.reset();
  }

  onSearch() {
    const formValues = this.filterForm.value;
    this.getData();
  }

}
// trigger rebuild
