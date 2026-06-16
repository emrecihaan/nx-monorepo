import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-form-approver-rule-detail',
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
    SelectModule
  ],
  providers: [MessageService],
  templateUrl: './form-approver-rule-detail.component.html',
  styleUrl: './form-approver-rule-detail.component.scss',
})
export class FormApproverRuleDetailComponent {
  showCreateRuleModal = false;
  selectedRow: any = null;
  newRule = {
    DfFormId: 0,
    RuleOrder: 0,
    DfSystemCompanyId: 0,
    ObJType: "",
    ObjId: "",
    Description: ""
  }
  showEditRuleModal = false;
  selectedForm: any = null;
  formList = [];
  showDeleteRuleModal = false;
  disable = false;
  id: any = null;
  data = [];
  ruleDetails = [];
  showEditModal = false;
  customizeGrid: any;
  customizeGridDetail: any;
  selectedRowDetail: any = null;
  showCreateRuleDetailModal = false;
  approverOTypeList: any = [
    { name: 'Seçiniz', id: '' },
    { name: 'P', id: 'P' },
    { name: 'S', id: 'S' },
    { name: 'O', id: 'O' },
  ];
  ApproverStopRSIGNList = [
    { name: 'Seçiniz', id: '' },
    { name: 'A', id: 'A' },
    { name: 'B', id: 'B' },
  ];
  updateRuleDetail = {
    DfFormApproverRuleId: 0,
    RuleField: "",
    Equality: "",
    RuleValue: "",
    ApproverOrder: 0,
    ApproverName: "",
    ApproverOType: "",
    ApproverObjId: "",
    ApproverStopRSIGN: "",
    ApproverOTypeStop: "",
    ApproverObjIdStop: "",
    ApproverOrderType: ""
  };
  newRuleDetail = {
    DfFormApproverRuleId: 0,
    RuleField: "",
    Equality: "",
    RuleValue: "",
    ApproverOrder: 0,
    ApproverName: "",
    ApproverOType: "",
    ApproverObjId: "",
    ApproverStopRSIGN: "",
    ApproverOTypeStop: "",
    ApproverObjIdStop: "",
    ApproverOrderType: ""
  };
  approverRuleOTypeList = [
    { name: 'Seçiniz', id: '' },
    { name: 'P', id: 'P' },
    { name: 'S', id: 'S' },
    { name: 'O', id: 'O' },
    { name: 'C', id: 'C' },
  ];
  selectedApproverOType: any = this.approverOTypeList[0];
  selectedApproverOTypeStop: any = this.approverOTypeList[0];
  selectedApproverStopRSIGN: any = this.ApproverStopRSIGNList[0];
  selectedApproverRuleOTypeList = this.approverRuleOTypeList[0];
  showDeleteRuleDetailModal = false;
  showUpdateRuleDetailModal = false;
  column = [
    {
      dataField: "rule.id",
      caption: "rule.id",
    },
    {
      dataField: "rule.ruleOrder",
      caption: "rule.ruleOrder",
    },
    {
      dataField: "rule.dfSystemCompanyId",
      caption: "rule.dfSystemCompanyId",
    },
    {
      dataField: "rule.objType",
      caption: "rule.objType",
    },
    {
      dataField: "rule.objId",
      caption: "rule.objId",
    },
    {
      dataField: "rule.description",
      caption: "rule.description",
    }
  ];

  detailColumn = [
    {
      dataField: "ruleField",
      caption: "ruleField",
    },
    {
      dataField: "equality",
      caption: "equality",
    },
    {
      dataField: "ruleValue",
      caption: "ruleValue",
    },
    {
      dataField: "approverOrder",
      caption: "approverOrder",
    },
    {
      dataField: "approverName",
      caption: "approverName",
    },
    {
      dataField: "approverOType",
      caption: "approverOType",
    },
    {
      dataField: "approverObjId",
      caption: "approverObjId",
    },
    {
      dataField: "approverStopRSIGN",
      caption: "approverStopRSIGN",
    },
    {
      dataField: "approverOTypeStop",
      caption: "approverOTypeStop",
    },
    {
      dataField: "approverObjIdStop",
      caption: "approverObjIdStop",
    },
    {
      dataField: "approverOrderType",
      caption: "approverOrderType",
    }
  ];

  private messageService = inject(MessageService);
  private formService = inject(FormService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private gridTranslate = inject(GridTranslateService);
  private translateService = inject(TranslateService);
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('dfFormId');
    console.log("id ", this.id)

    this.getFormApproveRules();
    this.getDfFormList();
    setTimeout(() => {
      this.customizeGrid = (columns: any[]) => {
        this.gridTranslate.traslateColumns("ruleColumns", columns);
      }

      this.customizeGridDetail = (columns: any[]) => {
        this.gridTranslate.traslateColumns("approverRuleDetailColumns", columns);
      }
    }, 1000);
  }

  setSelectedRow(selected: any) {
    this.selectedRow = selected;
  }
  setSelectedRowDetail(selected: any) {
    this.selectedRowDetail = selected;
  }
  showCreateRule() {
    this.showCreateRuleModal = true;
  }

  showEditRule() {
    if (this.selectedRow) {
      this.newRule.DfFormId = this.selectedRow.rule.dfForm.id;
      this.newRule.RuleOrder = this.selectedRow.rule.ruleOrder;
      this.newRule.DfSystemCompanyId = this.selectedRow.rule.dfSystemCompanyId;
      this.showEditRuleModal = true;
      this.selectedForm = this.formList.find((x: any) => x.id == this.selectedRow.rule.dfForm.id);
      this.newRule.Description = this.selectedRow.rule.description;
      this.newRule.ObjId = this.selectedRow.rule.objId;

    }
    else {
      this.messageService.add({
        severity: "warn",
        summary: "Uyarı",
        detail: "Lütfen düzenlemek için bir kural seçiniz.",
      });
    }
  }
  showDeleteRule() {
    if (this.selectedRow) {
      this.showDeleteRuleModal = true;
    }
    else {
      this.messageService.add({
        severity: "warn",
        summary: "Uyarı",
        detail: "Lütfen silmek için bir kural seçiniz.",
      });
    }
  }

  copyRule() {
    if (!this.selectedRow) {
      this.messageService.add({
        severity: "warn",
        summary: "Uyarı",
        detail: "Lütfen kopyalamak için bir kural seçiniz.",
      });
      return;
    }

    const model = {
      Id: this.selectedRow.rule.id
    };
    this.disable = true;
    this.formService.copyDfFormApproveRule(model).subscribe((res: any) => {
      if (res.code == "200") {

        let msg = "Onay Kural Kopyalama işlemi başarıyla gerçekleştirildi.";
        // if (res.message && res.message.length > 0) {
        //   msg = res.message[0]; // Listenin ilk elemanını al
        // }

        this.messageService.add({
          severity: "success",
          summary: "Başarılı",
          detail: msg,
        });

        this.getFormApproveRules();
      }
      else {
        let errorMsg = "Bir hata oluştu.";
        if (res.message && res.message.length > 0) {
          errorMsg = res.message[0];
        }

        this.messageService.add({
          severity: "error",
          summary: "Hata",
          detail: errorMsg
        });
      }
      this.disable = false;
    });
  }

  showDetail() {
    if (this.selectedRow != null) {
      {
        this.getDfFormApproveRuleDetailsByApproveRuleId(this.selectedRow.rule.id)
        this.showEditModal = true;
      }

    }
    else {
      this.messageService.add({
        severity: "warn",
        summary: "Uyarı",
        detail: "Lütfen detaylarını görüntülemek için bir kural seçiniz.",
      });
    }
  }

  getDfFormApproveRuleDetailsByApproveRuleId(id: any) {
    this.formService.getDfFormApproveRuleDetailsByRuleId(id).subscribe((res: any) => {
      if (res.code == "200") {
        this.ruleDetails = res.response;
        //this.showEditModal = false;
      }
    });
  }

  openUpdateRuleDetailModal() {
    if (this.selectedRowDetail) {
      this.selectedApproverOType = this.approverOTypeList.find((x: any) => x.id == this.selectedRowDetail.approverOType);
      this.selectedApproverOTypeStop = this.approverOTypeList.find((x: any) => x.id == this.selectedRowDetail.approverOTypeStop);
      this.selectedApproverStopRSIGN = this.ApproverStopRSIGNList.find((x: any) => x.id == this.selectedRowDetail.approverStopRSIGN);
      this.updateRuleDetail = { ...this.selectedRowDetail };

      this.showUpdateRuleDetailModal = true;
    }
    else {
      this.messageService.add({
        severity: "warn",
        summary: "Uyarı",
        detail: "Lütfen düzenlemek için bir kural detayı seçiniz.",
      });
    }
  }

  showDelete() {
    console.log(this.selectedRowDetail)
    if (this.selectedRowDetail) {
      this.showDeleteRuleDetailModal = true;
    }
    else {
      this.messageService.add({
        severity: "warn",
        summary: "Uyarı",
        detail: "Lütfen silmek için bir kural detayı seçiniz.",
      });
    }

  }

  create() {
    this.newRuleDetail.DfFormApproverRuleId = this.selectedRow.rule.id;
    this.newRuleDetail.ApproverOType = this.selectedApproverOType.id;
    this.newRuleDetail.ApproverOTypeStop = this.selectedApproverOTypeStop.id;
    this.newRuleDetail.ApproverStopRSIGN = this.selectedApproverStopRSIGN.id;

    if (this.newRuleDetail.ApproverOrder == 0 || this.newRuleDetail.ApproverName == "") {
      return this.messageService.add({
        severity: "warn",
        summary: "Uyarı",
        detail: "Onay Sırası veya Onaylayan Adı alanları zorunludur.",
      });

    }
    this.disable = true;
    this.formService.createDfFormApproveRuleDetail(this.newRuleDetail).subscribe((res: any) => {
      if (res.code == "200") {
        this.getDfFormApproveRuleDetailsByApproveRuleId(this.selectedRow.rule.id)
        this.messageService.add({
          severity: "success",
          summary: "Başarılı",
          detail: "Onay Kural Detayı ekleme işlemi başarıyla gerçekleştirildi.",
        });
        this.showCreateRuleDetailModal = false;
        this.newRuleDetail = {
          DfFormApproverRuleId: 0,
          RuleField: "",
          Equality: "",
          RuleValue: "",
          ApproverOrder: 0,
          ApproverName: "",
          ApproverOType: "",
          ApproverObjId: "",
          ApproverStopRSIGN: "",
          ApproverOTypeStop: "",
          ApproverObjIdStop: "",
          ApproverOrderType: ""
        };

        //this.showEditModal = false;
      }
      this.disable = false;
    }
    )
  }

  update() {
    if (this.selectedRowDetail) {
      this.updateRuleDetail.DfFormApproverRuleId = this.selectedRow.rule.id;
      this.updateRuleDetail.ApproverOType = this.selectedApproverOType.id;
      this.updateRuleDetail.ApproverOTypeStop = this.selectedApproverOTypeStop.id;
      this.updateRuleDetail.ApproverStopRSIGN = this.selectedApproverStopRSIGN.id;
      if (this.updateRuleDetail.ApproverOrder == 0 || this.updateRuleDetail.ApproverName == "") {
        return this.messageService.add({
          severity: "warn",
          summary: "Uyarı",
          detail: "Onay Sırası veya Onaylayan Adı alanları zorunludur.",
        });

      }
      this.disable = true;
      this.formService.updateDfFormApproveRuleDetail(this.updateRuleDetail).subscribe((res: any) => {
        if (res.code == "200") {
          this.messageService.add({
            severity: "success",
            summary: "Başarılı",
            detail: "Onay Kural Detayı güncelleme işlemi başarıyla gerçekleştirildi.",
          });
          this.getDfFormApproveRuleDetailsByApproveRuleId(this.selectedRow.rule.id)
          this.showUpdateRuleDetailModal = false;
          // this.showEditModal = false;

        }
        this.disable = false;
      }
      )
    }
  }

  delete() {
    if (this.selectedRowDetail) {
      this.disable = true;
      this.formService.deleteDfFormApproveRuleDetail({ RuleDetailId: this.selectedRowDetail.id }).subscribe((res: any) => {
        if (res.code == "200") {
          this.messageService.add({
            severity: "success",
            summary: "Başarılı",
            detail: "Onay Kural Detayı silme işlemi başarıyla gerçekleştirildi.",
          });
          this.getDfFormApproveRuleDetailsByApproveRuleId(this.selectedRow.rule.id)
          this.showDeleteRuleDetailModal = false;
          //this.showEditModal = false;
        }
        this.disable = false;
      }
      )
    }
  }

  createRule() {
    this.newRule.DfFormId = this.selectedForm.id;
    this.newRule.ObJType = this.selectedApproverRuleOTypeList.id;
    var isIn = this.data.find((d: any) => d.rule.ruleOrder == this.newRule.RuleOrder);
    if (isIn) {
      return this.messageService.add({
        severity: "warn",
        summary: "Uyarı",
        detail: "Aynı sırada birden fazla onay kuralı olamaz. Lütfen farklı bir sıra numarası giriniz.",
      });

    }
    if (this.newRule.Description == "" || this.newRule.DfSystemCompanyId == 0) {
      return this.messageService.add({
        severity: "warn",
        summary: "Uyarı",
        detail: "Firma Id ve Açıklama alanları boş bırakılamaz.",
      });
    }
    this.disable = true;
    this.formService.createDfFormApproveRule(this.newRule).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: "Başarılı",
          detail: "Onay Kuralı ekleme işlemi başarıyla gerçekleştirildi.",
        });
        this.getFormApproveRules();
        this.showCreateRuleModal = false;
        this.newRule = {
          DfFormId: 0,
          RuleOrder: 0,
          DfSystemCompanyId: 0,
          ObjId: "",
          ObJType: "",
          Description: ""
        };
        this.selectedForm = null;
      }
      this.disable = false
    }
    );
  };

  updateRule() {
    if (this.selectedRow) {

      this.newRule.DfFormId = this.selectedForm.id;
      this.newRule.ObJType = this.selectedApproverRuleOTypeList.id;
      var updatedRule = { ...this.newRule, ApproverRuleId: this.selectedRow.rule.id };

      this.disable = true;
      this.formService.updateDfFormApproveRule(updatedRule).subscribe((res: any) => {
        if (res.code == "200") {
          this.messageService.add({
            severity: "success",
            summary: "Başarılı",
            detail: "Onay Kuralı güncelleme işlemi başarıyla gerçekleştirildi.",
          });
          this.getFormApproveRules();
          this.showEditRuleModal = false;
          this.selectedForm = null;
        }
        this.disable = false;

      });
    }
  }

  deleteRule() {
    if (this.selectedRow) {
      this.disable = true;
      this.formService.deleteDfFormApproveRule({ ApproverRuleId: this.selectedRow.rule.id }).subscribe((res: any) => {
        if (res.code == "200") {
          this.showDeleteRuleModal = false;
          this.getFormApproveRules();
          this.messageService.add({
            severity: "success",
            summary: "Başarılı",
            detail: "Onay Kuralı silme işlemi başarıyla gerçekleştirildi.",
          });
        }
        this.disable = false;
      }
      )
    }

  }
  //#region  Get Methods
  getFormApproveRules() {
    this.formService.getFormApproveRulesAndDetailsByFormId(this.id).subscribe((res: any) => {
      if (res.code == "200") {
        this.data = res.response;
      }
    });
  }

  getDfFormList() {
    this.formService.getAllDfForm().subscribe((res: any) => {
      if (res.code == "200") {
        this.formList = res.response.map((item: any) => {
          return {
            id: item.id,
            name: item.description
          }
        });
        this.selectedForm = this.formList.find((d: any) => d.id == this.id);
      }
    })

  };
  //#endregion
}
