import { Component, HostListener, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DxChartComponent, DxPivotGridComponent, DxChartModule, DxPivotGridModule } from 'devextreme-angular';
import { FormService, GeneralSystemService } from '@my-micro-frontend/shared-core';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { FloatLabelModule } from 'primeng/floatlabel';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

@Component({
  selector: 'app-budget-report-organization',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DxChartModule,
    DxPivotGridModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    ToastModule,
    TranslateModule,
    AccordionModule,
    FloatLabelModule
  ],
  providers: [MessageService],
  templateUrl: './budget-report-organization.component.html',
  styleUrls: ['./budget-report-organization.component.scss']
})

export class BudgetReportOrganizationComponent implements OnInit, AfterViewInit {

  @ViewChild('chart') chart!: DxChartComponent;
  @ViewChild('pivotGrid') pivotGrid!: DxPivotGridComponent;
  formList: any[] = [];
  selectedForm: any = null;
  startDate = new Date();
  endDate = new Date();
  organizationList: any[] = [];
  selectedOrganization: any = null;
  data: any[] = [];
  statusList =
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
    public generalService: GeneralSystemService,
    public messageService: MessageService
  ) {
    this.startDate.setDate(this.startDate.getDate() - 365);
    this.endDate.setDate(this.endDate.getDate() + 30);
  }

  ngOnInit(): void {
    this.isMobile();
    this.getFormList();
    this.getOrganizationListForDropdown();
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
    this.getUser();
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
      console.log(res, "form list response");
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

  changeSelectedOrganization(newValue: any) {
    this.selectedOrganization = newValue.value;
  }

  changeSelectedStatus(newValue: any) {
    this.selectedStatus = newValue.value;
  }

  getOrganizationListForDropdown() {
    this.formService.getOrganizationListForDropdown().subscribe((res: any) => {
      this.organizationList = res.response.map((item: any) => {
        return {
          name: item.objid + " " + item.text,
          id: item.objid
        }
      });
    });
  }

  //   {
  //   "dfFormId": 1,
  //   "orgeh": "50000487",
  //   "startDate": "2025-02-04T10:26:18.188Z",
  //   "endDate": "2026-12-04T10:26:18.188Z",
  //   "statusId": 1
  // }
  getBudgetReportForOrganization() {
    if (this.startDate > this.endDate) {
      return this.messageService.add({
        severity: "error",
        summary: "Hata",
        detail: "Başlanguç tarihi, bitiş tarihinden büyük olamaz.",
      });
    }
    this.formService.getOrganizationTrFormReport({
      dfFormId: this.selectedForm?.id ?? "",
      orgeh: this.selectedOrganization?.id ?? "",
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      statusId: 1
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

  getUser() {
    return this.generalService.getUserRedis().subscribe(async (res: any) => {
      if (res.code !== "99") {
        this.user = res.response;
        console.log("user", this.user);
        if (this.user.oRGEH) {
          this.selectedOrganization = this.organizationList.find(f => f.id == this.user.oRGEH);
          console.log("selected organization", this.selectedOrganization);
        }

      }
    })
  }

  isMobile() {
    return window.innerWidth <= 1391 ? true : false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isMobile();
  }

}