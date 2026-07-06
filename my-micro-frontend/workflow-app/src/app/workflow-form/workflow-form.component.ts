import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
import { FormService, SystemService } from '@my-micro-frontend/shared-core';
import { AccordionModule } from 'primeng/accordion';

export enum TrFormStatusId {
  Item = 0,
  New = 1,
  WaitingForApproval = 2,
  Approved = 3,
  Rejected = 4
}

@Component({
  selector: 'app-workflow-form',
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
  templateUrl: './workflow-form.component.html',
  styleUrls: ['./workflow-form.component.scss']
})
export class WorkflowFormComponent implements OnInit {

  formSubmitted = false;
  workflowForm!: FormGroup;
  formTitle: string = "";
  selectedRow: any;
  columns: any = [];
  Data: any = [];
  formTypeList = [];
  user: any;
  selectedFormType = { id: 1 };
  data = [];
  statusOptions = [
    { id: 1, name: 'Aktif' },
    { id: 2, name: 'Pasif' }
  ];
  column = [
    {
      dataField: "id",
      caption: "id",
      alignment: "left"
    },
    {
      dataField: "dfForm.description",
      caption: "dfForm.description",
      alignment: "left"
    },
    {
      dataField: "userName",
      caption: "userName",
      alignment: "left"
    },
    {
      dataField: "formApplyCycle",
      caption: "formApplyCycle",
      alignment: "left"
    },
    {
      dataField: "statusName",
      caption: "statusName",
      alignment: "left"
    }
  ];
  customizeGrid: any;

  private formService = inject(FormService);
  private systemService = inject(SystemService);
  private translateService = inject(TranslateService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  constructor() {
    this.getDfFormList();
    this.getUser();
  }

  ngOnInit(): void {
    this.initializeColumns();

    setTimeout(() => {
      this.customizeGrid = (columns: any[]) => {
        for (const iterator of columns) {
          iterator.caption = this.translateService.instant("formListColumns" + "." + iterator.name);
        }
      }
    }, 1000);
  }

  setSelectedRow(value: any) {
    this.selectedRow = value;
  }

  initializeColumns() {
    this.columns = [];
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.workflowForm.invalid) return;
  }

  onRowUpdate(e: any) {
    e.cancel = true;
  }
  changeSelectedFormType(newValue: any) {
    this.selectedFormType = newValue.value;
  }

  detail() {
    if (this.selectedRow != null) {
      console.log("deneme", this.selectedRow);
      this.router.navigate(['/app/form-app/dynamic-form', this.selectedRow.dfForm.id, this.selectedRow.id]);
    }
    else {
      this.messageService.add({
        severity: 'warn',
        summary: this.translateService.instant("WARNING"),
        detail: this.translateService.instant("fieldWarning")
      });
    }

  }
  //#region Get Method
  getDfFormList() {
    return this.formService.getAllForm().subscribe((res: any) => {
      if (res.code != "99") {
        this.formTypeList = res.response.map((r: any) => {
          return { id: r.id, name: r.description };
        });
        // this.data = res.response;
      }
    });
  }
  getUser() {
    return this.systemService.getUserRedis().subscribe(async (res) => {
      if (res.code !== "99") {
        this.user = res.response;
        this.getFormList(this.selectedFormType.id, this.user.id);
      }
    })
  }
  getFormList(formId: any, userId: any) {
    this.systemService.getRoleByUserId(userId).subscribe((res: any) => {
      if (res.code != "99") {
        if (res.response.roleCode == "MASRAF_ADMIN") {
          this.formService.getFormListByDfFormId(formId).subscribe((res) => {
            if (res.code != "99") {
              this.data = res.response.map((r: any) => {
                return { ...r, statusName: this.translateService.instant(TrFormStatusId[r.dfFormStatusId]) }
              })
            }
          })

        } else {
          this.formService.getFormListByDfFormIdAndUserId(formId, userId).subscribe((res: any) => {
            if (res.code != "99") {
              this.data = res.response.map((r: any) => {
                return { ...r, statusName: this.translateService.instant(TrFormStatusId[r.dfFormStatusId]) }
              })
            }
          })
        }
      }
    })

  }
  //#endregion
}
