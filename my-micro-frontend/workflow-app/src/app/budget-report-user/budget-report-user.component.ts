import { Component, HostListener, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DxChartComponent, DxPivotGridComponent, DxChartModule, DxPivotGridModule } from 'devextreme-angular';
import { FormService, SystemService } from '@my-micro-frontend/shared-core';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AccordionModule } from 'primeng/accordion';
import { TranslateModule } from '@ngx-translate/core';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

@Component({
  selector: 'app-budget-report-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    DxChartModule,
    DxPivotGridModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    ToastModule,
    FloatLabelModule,
    AccordionModule,
    TranslateModule
  ],
  providers: [MessageService],
  templateUrl: './budget-report-user.component.html',
  styleUrls: ['./budget-report-user.component.scss']
})

export class BudgetReportUserComponent implements OnInit, AfterViewInit {
  @ViewChild('chart') chart!: DxChartComponent;
  @ViewChild('pivotGrid') pivotGrid!: DxPivotGridComponent;


  formList: any[] = [];
  selectedForm: any = null;
  startDate: Date | null = null;
  endDate: Date | null = null;
  userList: any[] = [];
  selectedUser: any = null;
  data: any[] = [];
  statusList: any[] =
    [
      { id: 1, name: "Onay Bekliyor" },
      { id: 2, name: "Onaylandı" },
      { id: 4, name: "Reddedildi" },
    ];
  selectedStatus: any = null;
  pivotGridDataSource: any;
  list: any[] = [];
  chartData: {
    organization: any; user: any; amount: any; date: any; // YYYY-MM-DD
  }[] = [];
  user: any = null;
  constructor(
    public formService: FormService,
    public systemService: SystemService,
    public messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.isMobile();
    this.getFormList();
    this.getUserList();
    // this.pivotGridDataSource = new PivotGridDataSource({
    //   fields: [{
    //     caption: 'Organizasyon',
    //     dataField: 'orgehText',
    //     width: 150,
    //     area: 'row',
    //   },
    //   {
    //     caption: 'Pozisyon',
    //     width: 120,
    //     dataField: 'plansText',
    //     area: 'row',
    //   },
    //   {
    //     caption: 'Harcama Yapan',
    //     width: 120,
    //     dataField: 'userName',
    //     area: 'row',
    //   },

    //   // {
    //   //   caption: 'PR No',
    //   //   dataField: 'ZzaribaReqNo',
    //   //   dataType: 'string',
    //   //   area: 'data',
    //   // },
    //   // {
    //   //   dataField: 'TalepTarihi',
    //   //   dataType: 'date',
    //   //   area: 'column',
    //   // }, 
    //   // {
    //   //   groupName: 'TalepTarihi',
    //   //   groupInterval: 'month',
    //   //   visible: false,
    //   // }, 
    //   // {
    //   //   caption: 'Total',
    //   //   dataField: 'BütceBilgisi',
    //   //   dataType: 'number',
    //   //   summaryType: 'sum',
    //   //   format: { type: 'currency', currency: 'TRY' },
    //   //   area: 'data',
    //   // },
    //   { caption: 'Rapor Tarihi', dataField: 'reportedDate', visible: false },
    //   { caption: 'Harcama Tutarı', dataField: 'totalAmount', visible: false },
    //   { caption: 'Bütçe Tutarı', dataField: 'budgetAmount', visible: false },

    //   ],
    //   store: this.list
    // });

  }

  ngAfterViewInit(): void {
    if (this.pivotGrid && this.chart) {
      this.pivotGrid.instance.bindChart(this.chart.instance, {
        dataFieldsDisplayMode: 'splitPanes',
        alternateDataFields: false,
      });
    }
  }


  customizeTooltip(args: any) {
    const valueText = args.seriesName.indexOf('totalAmount') !== -1
      ? new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(args.originalValue)
      : args.originalValue;

    return {
      html: `${args.seriesName}<div class='currency'>${valueText}</div>`,
    };
  }



  getFormList() {
    this.formService.getAllDfForm().subscribe((res: any) => {
      this.formList = res.response.map((item: any) => {
        return {
          name: item.description,
          id: item.id
        }
      });
    });
  }

  changeSelectedForm(newValue: any) {
    this.selectedForm = newValue.value;
    console.log(newValue)
  }

  changeSelectedUser(newValue: any) {
    this.selectedUser = newValue.value;
  }

  changeSelectedStatus(newValue: any) {
    this.selectedStatus = newValue.value;
  }



  //   {
  //   "dfFormId": 1,
  //   "orgeh": "50000487",
  //   "startDate": "2025-02-04T10:26:18.188Z",
  //   "endDate": "2026-12-04T10:26:18.188Z",
  //   "statusId": 1
  formatLocalISODate(date: Date): string {
    if (!date) return '';
    const tzOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    return new Date(date.getTime() - tzOffset).toISOString().split('T')[0] + 'T00:00:00';
  }

  getBudgetReportForUser() {
    if (!this.selectedForm || !this.selectedUser || !this.selectedStatus || !this.startDate || !this.endDate) {
      this.messageService.add({
        severity: "warn",
        summary: "Uyarı",
        detail: "Lütfen arama yapmadan önce tüm filtre alanlarını doldurunuz.",
      });
      return;
    }
    const start = new Date(this.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(this.endDate);
    end.setHours(0, 0, 0, 0);
    
    if (start > end) {
      return this.messageService.add({
        severity: "error",
        summary: "Hata",
        detail: "Başlangıç tarihi, bitiş tarihinden büyük olamaz.",
      });
    }
    this.formService.getUserTrFormReport({
      DfFormId: this.selectedForm.id,
      UserId: this.selectedUser.id != null ? this.selectedUser.id : "",
      startDate: this.formatLocalISODate(this.startDate),
      endDate: this.formatLocalISODate(this.endDate),
      StatusId: this.selectedStatus.id
    }).subscribe((res: any) => {
      if (res.code == "200") {
        this.data = res.response;
        this.pivotGridDataSource = new PivotGridDataSource({
          fields: [
            { caption: "Organizasyon", dataField: "orgehText", area: "row" },
            { caption: "Pozisyon", dataField: "plansText", area: "row" },
            { caption: "Harcama Yapan", dataField: "userName", area: "row" },

            // Tarih sadece column alanında kullanılacak
            {
              caption: "Rapor Tarihi",
              dataField: "reportedDate",
              area: "column",
              dataType: "date",
              format: "yyyy-MM-dd"
            },

            { caption: "Harcama Tutarı", dataField: "totalAmount", area: "data", summaryType: "sum" },
            { caption: "Bütçe Tutarı", dataField: "budgetAmount", area: "data", summaryType: "sum" }
          ],
          store: this.data
        });
        this.prepareChartData();
      }

    })

  }


  prepareChartData() {
    this.chartData = this.data.map((x: any) => ({
      organization: x.orgehText,
      user: x.userName,
      amount: x.totalAmount,
      date: x.reportedDate.substring(0, 10) // YYYY-MM-DD
    }));
  }


  getUserList() {
    return this.systemService.getUsers().subscribe((res: any) => {
      const users = Array.isArray(res) ? res : (res?.response || []);
      this.userList = users.map((item: any) => ({ id: item.id, name: item.userName + " " + item.userSurname }));
    });
  }

  isMobile() {
    return window.innerWidth <= 1391 ? true : false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isMobile();
  }


}