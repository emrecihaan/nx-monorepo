import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormService, GridTranslateService } from '@my-micro-frontend/shared-core';
import { DatagridForFormatComponent } from '@my-micro-frontend/shared-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-form-approver-rule',
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
    InputTextModule
  ],
  providers: [MessageService],
  templateUrl: './form-approver-rule.component.html',
  styleUrl: './form-approver-rule.component.scss',
})
export class FormApproverRuleComponent implements OnInit {

  data = [];
  column = [
    {
      dataField: "id",
      caption: "id",
      alignment: "left",
      width: 100
    },
    {
      dataField: "description",
      caption: "description",
    },
    {
      dataField: "isActive",
      caption: "isActive",
    },
    {
      dataField: "isApproval",
      caption: "isApproval",
    },
    {
      dataField: "isItem",
      caption: "isItem",
    }
  ];
  customizeGrid: any;
  selectedRow = null;

  private formService = inject(FormService);
  private translateService = inject(TranslateService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private gridTranslate = inject(GridTranslateService);

  ngOnInit(): void {
    this.getDfFormList();
    setTimeout(() => {
      this.customizeGrid = (columns: any[]) => {
        this.gridTranslate.traslateColumns("dfFormColumns", columns);
      }
    }, 1000);
  }

  setSelectedRow(selected: any) {
    this.selectedRow = selected;
    this.router.navigate(['/app/workflow-app/formapproverruledetail', selected.id]);
  }

  //#region Get Methods
  getDfFormList() {
    var list: any = [];
    this.formService.getAllDfForm().subscribe((res: any) => {
      if (res.code == "200") {
        for (let item of res.response) {
          if (item.isApproval == true) {
            list.push(item);
          }
        }
      }
    }
    );
    this.data = list;
  }
  //#endregion
}
