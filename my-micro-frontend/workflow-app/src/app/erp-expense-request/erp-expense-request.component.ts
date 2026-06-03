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
    DatagridForFormatComponent
  ],
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
    },
    {
      dataField: "status",
      caption: "Durum",
    },
    {
      dataField: "activity",
      caption: "Aktivite",
    },
    {
      dataField: "year",
      caption: "Yıl",
    },
    {
      dataField: "month",
      caption: "Ay",
    },
    {
      dataField: "amount",
      caption: "Tutar",
    },
    {
      dataField: "amountExcludingVat",
      caption: "KdvHariç",
    },
    {
      dataField: "budgetOverrun",
      caption: "Bütçe Aşım",
    },
    {
      dataField: "requestOwner",
      caption: "Talep Sahibi",
    },
    {
      dataField: "personnelCode",
      caption: "Personel Kodu",
    },
    {
      dataField: "paymentType",
      caption: "Ödeme Türü",
    },
    {
      dataField: "odk",
      caption: "Ödk",
    },
    {
      dataField: "ledger",
      caption: "Kebir",
    },
    {
      dataField: "requestHandler",
      caption: "Talep Kimde",
    },
    {
      dataField: "evaluation",
      caption: "Değerlendirme",
    },
    {
      dataField: "transferInfo",
      caption: "Aktarım Bilgisi",
    }
  ];
  detailColumn = [
    {
      dataField: "id",
      caption: "ID"
    },
    {
      dataField: "expenseType",
      caption: "Harcama Türü"
    },
    {
      dataField: "date",
      caption: "Tarih",
      dataType: "date"
    },
    {
      dataField: "amount",
      caption: "Tutar"
    },
    {
      dataField: "expenseDescription",
      caption: "Açıklama"
    },
    {
      dataField: "department",
      caption: "Departman"
    },
    {
      dataField: "project",
      caption: "Proje"
    },
    {
      dataField: "file",
      caption: "Dosya"
    }
  ];
  selectedRows: any[] = [];
  detailHeader: string = "expenseRequestDetailColums";
  options = [];
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
    private fb: FormBuilder
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
    var model = this.filterForm.value;
    this.formService.getExpenseRequestForms(model).subscribe((res: any) => {
      if (res.code != "99") {
        this.data = res.response;
      }
    })
  }

  callShow(event: any) {
    this.router.navigate(['/dynamic-form', 0, event.id]);
  }

  setSelectedRows(value: any) {
    this.selectedRows = value;
  }

  sendSAP() {
    this.formService.createExpenseRequestSAP(this.selectedRows).subscribe((res: any) => {
      if (res.code != "99") {
        console.log("Hata!");
      }
    })
  }

  onClear() {
    this.filterForm.reset();
  }

  onSearch() {
    const formValues = this.filterForm.value;
    this.getData();
  }

}