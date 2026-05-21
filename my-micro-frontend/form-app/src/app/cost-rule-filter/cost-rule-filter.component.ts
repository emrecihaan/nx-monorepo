import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormService, GridTranslateService } from '@my-micro-frontend/shared-core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService, TreeNode } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { CrudDataGridComponent } from '@my-micro-frontend/shared-ui';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'app-cost-rule-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    ButtonModule,
    CardModule,
    ToastModule,
    ToolbarModule,
    PanelModule,
    DialogModule,
    FloatLabelModule,
    InputTextModule,
    TreeModule,
    CrudDataGridComponent
  ],
  providers: [MessageService],
  templateUrl: './cost-rule-filter.component.html',
  styleUrls: ['./cost-rule-filter.component.scss']
})
export class CostRuleFilterComponent implements OnInit {
  data: TreeNode[] = [];
  selectedData: any = null;
  filterDetaildata = [];
  columnFilterDetail = [
    // {
    //   dataField: "id",
    //   caption: "id",
    // },
    {
      dataField: "objId",
      caption: "objId",
    },
    {
      dataField: "objType",
      caption: "objType",
    }
  ];
  columnObject = [
    // {
    //   dataField: "id",
    //   caption: "id",
    // },
    {
      dataField: "objId",
      caption: "objId",
    },
    {
      dataField: "objType",
      caption: "objType",
    }
  ];
  customizeGridFilterDetail: any;
  selectedRowFilterDetail = null;
  objectdata = [];
  selectedRowObject = null;
  createModalShow = false;
  updateModalShow = false;
  deleteModalShow = false;
  customizeGridObject: any;
  newCostRuleFilterData = {
    Description: "",
    RuleId: 0
  }
  editCostRuleFilterData = {
    Description: ""
  }
  costRuleId: number | null = null;
  private route = inject(ActivatedRoute);
  private formService = inject(FormService);
  private translateService = inject(TranslateService);
  private messageService = inject(MessageService);
  private gridTranslate = inject(GridTranslateService);

  ngOnInit(): void {
    this.costRuleId = Number(this.route.snapshot.paramMap.get('id'));
    this.newCostRuleFilterData.RuleId = Number(this.costRuleId);
    this.getCostRuleFilterByCostRuleId();
    setTimeout(() => {
      this.customizeGridFilterDetail = (columns: any[]) => {
        this.gridTranslate.traslateColumns("costRuleFilterDetailColumns", columns);
      }
      this.customizeGridObject = (columns: any[]) => {
        this.gridTranslate.traslateColumns("costRuleFilterDetailColumns", columns);
      }
    }, 1000);
  }

  //#region For Datagrid
  setSelectedFilterRow(selected: any) {
    this.selectedRowFilterDetail = selected;
    //this.router.navigate(['/formapproverruledetail', selected.id]);
  }

  setSelectedObjectRow(selected: any) {
    this.selectedRowObject = selected;
    //this.router.navigate(['/formapproverruledetail', selected.id]);
  }
  openCreateModalShow() {
    this.createModalShow = true;
    this.newCostRuleFilterData.Description = "";
  }


  openUpdateModalShow() {
    if (this.selectedData) {
      this.editCostRuleFilterData = {
        Description: this.selectedData.label
      };
      this.updateModalShow = true;
    } else {
      this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectData'),
      });
    }
  }

  openDeleteModalShow() {
    if (this.selectedData) {
      this.deleteModalShow = true;
    } else {
      this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectData'),
      });
    }
  }
  //#endregion
  //#region Post Methods
  copyCostRuleFilter() {
    if (!this.selectedData) {
      this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectData'),
      });
      return;
    }

    const originalId = this.selectedData.data.id;
    const newLabel = this.selectedData.label + ' - Copy';

    const newFilterModel = {
      Description: newLabel,
      RuleId: this.newCostRuleFilterData.RuleId
    };

    this.formService.createCostRuleFilter(newFilterModel).subscribe((res: any) => {
      if (res.code == "200") {
        const newFilterId = res.response.id;

        this.messageService.add({
          severity: "info",
          summary: this.translateService.instant("info"),
          detail: this.translateService.instant('messageServiceMessages.copyingContent'),
        });

        this.formService.getCostRuleFilterDetailsByRuleFilterId(originalId).subscribe((detailRes: any) => {
          if (detailRes.code == "200" && detailRes.response) {
            detailRes.response.forEach((item: any) => {
              const detailModel = {
                ObjId: item.objId,
                ObjType: item.objType,
                RuleFilterId: newFilterId
              };
              this.formService.createCostRuleFilterDetail(detailModel).subscribe();
            });
          }
        });

        this.formService.getCostRuleObjectsByRuleFilterId(originalId).subscribe((objRes: any) => {
          if (objRes.code == "200" && objRes.response) {
            objRes.response.forEach((item: any) => {
              const objectModel = {
                ObjId: item.objId,
                ObjType: item.objType,
                RuleFilterId: newFilterId,
                RuleId: this.newCostRuleFilterData.RuleId
              };
              this.formService.createCostRuleObject(objectModel).subscribe();
            });
          }
        });

        setTimeout(() => {
          this.messageService.add({
            severity: "success",
            summary: this.translateService.instant("success"),
            detail: this.translateService.instant('messageServiceMessages.copyFinished'),
          });

          this.selectedData = null;
          this.filterDetaildata = [];
          this.objectdata = [];
          this.getCostRuleFilterByCostRuleId();
        }, 1000);
      }
    });
  }

  createCostRuleObject(data: any) {
    console.log(data);
    var model = {
      ObjId: data.objId,
      ObjType: data.objType,
      RuleFilterId: this.selectedData.data.id,
      RuleId: this.newCostRuleFilterData.RuleId
    };
    return this.formService.createCostRuleObject(model).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordAddedSuccessfully'),
        })
        this.getCostRuleObjectsByRuleFilterId(this.selectedData.data.id);
      }
    });
  }

  updateCostRuleObject(data: any) {
    console.log(data);
    var find: any = this.objectdata.find((x: any) => x.id == data.oldData.id);
    var model = {
      Id: find.id, ObjId: data.oldData.objId,
      ObjType: data.oldData.objType,
      RuleFilterId: this.selectedData.data.id,
      RuleId: this.newCostRuleFilterData.RuleId,
      ...data.newData
    };
    if (data.newData.objId) {
      model.ObjId = data.newData.objId
    }
    if (data.newData.objType) {
      model.ObjType = data.newData.objType
    }
    return this.formService.updateCostRuleObject(model).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordUpdatedSuccessfully'),
        })
        this.getCostRuleObjectsByRuleFilterId(this.selectedData.data.id);
      }
    });
  }
  deleteCostRuleObject(data: any) {
    console.log(data);
    var find: any = this.objectdata.find((x: any) => x.objId == data.objId && x.objType == data.objType);
    var model = {
      Id: find.id, ObjId: data.objId,
      ObjType: data.objType,
      RuleFilterId: this.selectedData.data.id,
      RuleId: this.newCostRuleFilterData.RuleId
    };
    return this.formService.deleteCostRuleObject(model).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordDeletedSuccessfully'),
        })
        this.getCostRuleObjectsByRuleFilterId(this.selectedData.data.id);
      }
    });
  }

  createCostRuleFilterDetail(data: any) {
    console.log(data);
    var model = {
      ObjId: data.objId,
      ObjType: data.objType,
      RuleFilterId: this.selectedData.data.id
    };
    return this.formService.createCostRuleFilterDetail(model).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordAddedSuccessfully'),
        })
        this.getCostRuleFilterDetailsByRuleFilterId(this.selectedData.data.id);
      }
    });
  }

  createCostRuleFilter() {
    if (this.newCostRuleFilterData.Description == '') {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('costRuleFilter.ruleNameReq'),
      });
    }
    this.formService.createCostRuleFilter(this.newCostRuleFilterData).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordAddedSuccessfully'),
        })
        this.getCostRuleFilterByCostRuleId();
        this.createModalShow = false;
        this.newCostRuleFilterData.Description = ""
      }
    });
  }
  updateCostRuleFilterDetail(data: any) {
    console.log(data);
    var find: any = this.filterDetaildata.find((x: any) => x.id == data.oldData.id);
    var model = {
      Id: find.id, ObjId: data.oldData.objId,
      ObjType: data.oldData.objType,
      RuleFilterId: this.selectedData.data.id,
      ...data.newData
    };
    if (data.newData.objId) {
      model.ObjId = data.newData.objId
    }
    if (data.newData.objType) {
      model.ObjType = data.newData.objType
    }
    return this.formService.updateCostRuleFilterDetail(model).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordUpdatedSuccessfully'),
        })
        this.getCostRuleFilterDetailsByRuleFilterId(this.selectedData.data.id);
      }
    });
  }
  deleteCostRuleFilterDetail(data: any) {
    console.log(data);
    var find: any = this.filterDetaildata.find((x: any) => x.objId == data.objId && x.objType == data.objType);
    var model = {
      Id: find.id, ObjId: data.objId,
      ObjType: data.objType,
      RuleFilterId: this.selectedData.data.id,
    };
    return this.formService.deleteCostRuleFilterDetail(model).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordDeletedSuccessfully'),
        })
        this.getCostRuleFilterDetailsByRuleFilterId(this.selectedData.data.id);
      }
    });
  }
  updateCostRuleFilter() {
    if (this.editCostRuleFilterData.Description == '') {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('costRuleFilter.ruleNameReq'),
      });
    }
    var model = {
      Id: this.selectedData.data.id,
      Description: this.editCostRuleFilterData.Description,
      RuleId: this.newCostRuleFilterData.RuleId
    };
    this.formService.updateCostRuleFilter(model).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordUpdatedSuccessfully'),
        })
        this.getCostRuleFilterByCostRuleId();
        this.updateModalShow = false;
      }
    });
  }
  deleteCostRuleFilter() {
    var model = {
      Id: this.selectedData.data.id,
      Description: this.selectedData.label,
      RuleId: this.newCostRuleFilterData.RuleId
    };
    this.formService.deleteCostRuleFilter(model).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordDeletedSuccessfully'),
        });

        this.selectedData = null;
        this.filterDetaildata = [];
        this.objectdata = [];

        this.getCostRuleFilterByCostRuleId();
        this.deleteModalShow = false;
      }
    });
  }
  //#endregion
  //#region Get Methods
  getCostRuleFilterByCostRuleId() {
    debugger;
    this.formService.getCostRuleFilterByCostRuleId(this.costRuleId!).subscribe((res: any) => {
      if (res.code == "200" && res.response) {
        console.log("res rule filter ", res);
        this.data = res.response.map((item: any) => {
          return {
            label: item.description,
            data: item,
            children: []
          };
        });
      }
    });
  }
  nodeSelect(event: any) {
    this.selectedData = event.node;
    this.getCostRuleFilterDetailsByRuleFilterId(this.selectedData.data.id);
    this.getCostRuleObjectsByRuleFilterId(this.selectedData.data.id);
  }
  getCostRuleFilterDetailsByRuleFilterId(ruleFilterId: any) {
    this.formService.getCostRuleFilterDetailsByRuleFilterId(ruleFilterId).subscribe((res: any) => {
      if (res.code == "200") {
        this.filterDetaildata = res.response;
      }
    });
  }
  getCostRuleObjectsByRuleFilterId(ruleFilterId: any) {
    this.formService.getCostRuleObjectsByRuleFilterId(ruleFilterId).subscribe((res: any) => {
      if (res.code == "200") {
        this.objectdata = res.response;
      }
    });
  }
  //#endregion
}
