import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormService, GeneralSystemService, GridTranslateService } from '@my-micro-frontend/shared-core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { DatagridForFormatComponent } from '@my-micro-frontend/shared-ui';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DatagridForFormatComponent,
    ToolbarModule,
    ButtonModule,
    RippleModule,
    TextareaModule,
    ToastModule,
    TranslateModule,
    FormsModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  providers: [MessageService]
})
export class AdminDashboardComponent implements OnInit {

  data = [];
  column = [
    {
      dataField: "formId",
      caption: "formId",
    },
    {
      dataField: "description",
      caption: "description",
    },
    {
      dataField: "isProxy",
      caption: "Is Proxy?",
      dataType: "boolean"
    },
    {
      dataField: "proxyOwnerName",
      caption: "Proxy Owner",
    },
    {
      dataField: "userName",
      caption: "userName",
    },
    {
      dataField: "formApplyCycle",
      caption: "formApplyCycle",
    }
  ];
  detailColumn = [
    {
      dataField: "approverName",
      caption: "approverName",
    },
    {
      dataField: "proxyOwnerName",
      caption: "Original Approver",
    },
    {
      dataField: "createdDate",
      caption: "createdDate",
    },
    {
      dataField: "dfFormStatusName",
      caption: "dfFormStatusName",
    },

    {
      dataField: "rejectReason",
      caption: "rejectReason",
    },

    {
      dataField: "trFormId",
      caption: "trFormId",
    },
  ];
  subMenuList: any[] = [];
  selectedRows: any[] = [];
  selectedRow: any;
  customizeGrid: any;
  customizeGridDetail: any;
  user: any;
  visibleRejectDialog: boolean = false;
  value!: string;
  userId: any;
  selectedStatusId = 0;
  selectedCardId: number = 2;
  detailHeader: string = "adminDashoardDataDetail";

  constructor(
    public formService: FormService,
    public generalService: GeneralSystemService,
    private messageService: MessageService,
    private router: Router,
    public translateService: TranslateService,
    private gridTranslate: GridTranslateService
  ) {
    const lang = localStorage.getItem('languageKey') || 'tr';
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.subMenuList = [
        {
          icon: "pi pi-wallet",
          name: this.translateService.instant("requestsPendingApproval"),
          isActive: false,
          type: "WaitingForApproval",
          color: "orange",
          id: 2
        },
        {
          icon: "pi pi-times-circle",
          name: this.translateService.instant("rejectedRequests"),
          isActive: false,
          color: "red",
          type: "Rejected",
          id: 4
        },
        {
          icon: "pi pi-check-circle",
          name: this.translateService.instant("approvedRequests"),
          isActive: false,
          type: "Approved",
          color: "green",
          id: 3
        },
      ]
      this.getFormList(2);

    }, 2000);
    setTimeout(() => {
      this.customizeGrid = (columns: any[]) => {
        this.gridTranslate.traslateColumns("adminDashboardColumns", columns);
      }
    }, 1000);
  }

  getFormList(statusId: any) {
    this.selectedCardId = statusId;
    this.selectedStatusId = statusId
    return this.generalService.getUserRedis().subscribe(async (res: any) => {
      this.userId = res.response.id;
      this.getFormCount(res.response.id);
      if (res.code !== "99") {
        this.formService.getApprovedTrFormsByApproverIdAndStatusId(res.response.id, statusId).subscribe((res1: any) => {
          if (res1.code != "99") {
            console.log(res1.response)
            this.data = res1.response.map((item: any) => {
              return {
                ...item,
                rowStyle: item.isProxy ? 'proxy-row' : ''
              };
            });
            console.log(this.data)
          }
        })
      }
    })
  }

  getFormCount(userId: any) {
    return this.formService.getApproversCountByStatusId(userId).subscribe((res: any) => {
      if (res.code != "99") {
        var list = [];
        for (const element of this.subMenuList) {
          var isIn = res.response.response.find((s: any) => s.type == element.type);
          if (isIn != undefined) {
            list.push({ ...element, number: isIn.count });
          }
        }
        this.subMenuList = list;
      }
    })
  }

  setSelectedRows(selected: any[]) {
    this.selectedRows = selected;
  }

  setSelectedRow(row: any) {
    this.selectedRow = row;
  }

  rejectDialog() {
    if (this.selectedRows.length > 1) {
      return this.messageService.add({
        severity: 'warn',
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectOneData')
      });
    }
    if (this.selectedRows.length != 0) {
      this.visibleRejectDialog = true;
    }
    else {
      return this.messageService.add({
        severity: 'warn',
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectDataFromTable')
      });
    }
  }

  closeDialog() {
    this.visibleRejectDialog = false;
  }

  cancel() {
    this.visibleRejectDialog = false;
    this.value = '';
  }

  reject() {
    if (this.value == undefined) {
      return this.messageService.add({
        severity: 'warn',
        summary: this.translateService.instant("error"),
        detail: 'Reddetme Talebi Giriniz'
      });
    }
    else {
      var model = [
        {
          trFormApproverId: this.selectedRows[0].id,
          dfFormStatusId: 4,
          rejectReason: this.value
        }
      ];
      this.formService.approveForm(model).subscribe((res: any) => {
        if (res.code == '200') {
          this.getFormCount(this.userId);
          this.getFormList(2);
          this.visibleRejectDialog = false;
          this.value = '';
          return this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant("success"),
            detail: this.translateService.instant('messageServiceMessages.rejectedData')
          });
        }
        else {
          return this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant("error"),
            detail: this.translateService.instant('messageServiceMessages.rejectedDataError')
          });
        }
      })
    }
  }

  approve() {
    const model = this.selectedRows.map((row, index) => {
      return {
        trFormApproverId: row.id,
        DfFormStatusId: 3
      };
    });
    this.formService.approveForm(model).subscribe({
      next: (res: any) => {
        if (res.code != "99") {
          this.messageService.add({ severity: 'success', summary: this.translateService.instant("success"), detail: this.translateService.instant("success") });
          window.location.reload();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant("error"),
            detail: res.message[0]
          });
        }
      },
      error: (err) => {
        const errorDetail = err?.error?.message || 'Unexpected error occurred';
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant("error"),
          detail: errorDetail
        });
      }
    });
  }

  detail() {
    if (this.selectedRows.length > 1) {
      return this.messageService.add({
        severity: 'warn',
        summary: this.translateService.instant('messageServiceMessages.missingValue'),
        detail: this.translateService.instant('messageServiceMessages.selectOneDataDetail')
      });
    }
    if (this.selectedRows.length != 0) {
      this.selectedRows.map((selectedRow) => {
        this.router.navigate(['app/form-app/dynamic-form', 0, selectedRow.formId]);
      })
    }
    else {
      this.messageService.add({
        severity: 'warn',
        summary: this.translateService.instant("warning"),
        detail: this.translateService.instant("fieldWarning")
      });
    }
  }

}