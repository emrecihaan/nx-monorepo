import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormService } from '@my-micro-frontend/shared-core';
import { DatagridForFormatComponent } from '@my-micro-frontend/shared-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { finalize } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-cost-rule',
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
  templateUrl: './cost-rule.component.html',
  styleUrls: ['./cost-rule.component.scss']
})
export class CostRuleComponent implements OnInit {
  customizeGrid: any;
  createModalShow = false;
  selectedRow: any = null;
  updateModalShow = false;
  deleteModalShow = false;
  isDisableButton: boolean = false;
  editCostRuleData = {
    Id: 0,
    RuleName: "",
    DfSystemCompanyId: 0
  }
  newCostRuleData = {
    RuleName: "",
    DfSystemCompanyId: 0
  }

  data: any[] = [];
  column: any[] = [
    { dataField: 'id', caption: 'ID' },
    { dataField: 'ruleName', caption: 'Kural Adı' },
    { dataField: 'description', caption: 'Açıklama' },
    { dataField: 'limitAmount', caption: 'Limit Tutar' },
    { dataField: 'isActive', caption: 'Durum' }
  ];

  private formService = inject(FormService);
  private translateService = inject(TranslateService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.getCostRuleList();
    setTimeout(() => {
      const lang = localStorage.getItem('languageKey');
      if (lang) {
        this.translateService.setDefaultLang(lang);
        this.translateService.use(lang);
      }
    }, 1000);
  }

  setSelectedRow(selected: any) {
    this.selectedRow = selected;
  }

  loadCostRules() {
    // Burada servis çağrısı yapılabilir. Örnek veri:
    this.data = [
      { id: 1, ruleName: 'Yemek Limiti', description: 'Günlük yemek harcama sınırı', limitAmount: 500, isActive: true },
      { id: 2, ruleName: 'Konaklama Limiti', description: 'Yurt içi konaklama sınırı', limitAmount: 3500, isActive: true },
      { id: 3, ruleName: 'Taksi Limiti', description: 'Aylık ulaşım desteği', limitAmount: 2000, isActive: false }
    ];
  }

  onRowClick(event: any) {
    console.log('Selected rule:', event);
  }

  addNewRule() {
    this.messageService.add({ severity: 'info', summary: 'Bilgi', detail: 'Yeni kural ekleme formu açılacak.' });
  }

  openCreateModalShow() {
    this.createModalShow = true;
  }

  openUpdateModalShow() {
    if (this.selectedRow) {
      this.editCostRuleData = {
        Id: this.selectedRow.id,
        RuleName: this.selectedRow.ruleName,
        DfSystemCompanyId: this.selectedRow.dfSystemCompanyId
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
    if (this.selectedRow) {
      this.deleteModalShow = true;
    } else {
      this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectData'),
      });
    }
  }

  goDetail() {
    if (this.selectedRow) {
      this.router.navigate(['../cost-rule-filter', this.selectedRow.id], { relativeTo: this.route });
    } else {
      this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectData'),
      });
    }
  }

  createCostRule() {
    console.log(this.newCostRuleData);
    if (this.newCostRuleData.RuleName == '' || this.newCostRuleData.RuleName == null) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('COST_RULE.ruleNameReq')
      });
    }
    if (this.newCostRuleData.DfSystemCompanyId == 0 || this.newCostRuleData.DfSystemCompanyId == null) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('COST_RULE.companyIdReq')
      });
    }
    this.isDisableButton = true;
    this.formService.createCostRule(this.newCostRuleData).pipe(finalize(() => this.isDisableButton = false)).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordAddedSuccessfully'),
        });
        this.newCostRuleData = {
          RuleName: "",
          DfSystemCompanyId: 0
        }
        this.getCostRuleList();
        this.createModalShow = false;
      }
    });
  }
  getCostRuleList() {
    this.formService.getCostRuleList().subscribe((res: any) => {
      if (res.code == "200") {
        this.data = res.response;
      }
    });
  }

  updateCostRule() {
    var model = {
      Id: this.editCostRuleData.Id,
      RuleName: this.editCostRuleData.RuleName,
      DfSystemCompanyId: this.editCostRuleData.DfSystemCompanyId
    };
    if (this.editCostRuleData.RuleName == '' || this.editCostRuleData.RuleName == null) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('COST_RULE.ruleNameReq')
      });
    }
    if (this.editCostRuleData.DfSystemCompanyId == 0 || this.editCostRuleData.DfSystemCompanyId == null) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('COST_RULE.companyIdReq')
      });
    }
    this.isDisableButton = true;
    this.formService.updateCostRule(model).pipe(finalize(() => this.isDisableButton = false)).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordUpdatedSuccessfully'),
        });
        this.editCostRuleData = {
          Id: 0,
          RuleName: "",
          DfSystemCompanyId: 0
        }
        this.getCostRuleList();
        this.updateModalShow = false;
      }
    });
  }

  deleteBudgetRule() {
    var model = {
      Id: this.selectedRow.id,
      RuleName: this.selectedRow.ruleName,
      DfSystemCompanyId: this.selectedRow.dfSystemCompanyId
    }
    this.isDisableButton = true;
    this.formService.deleteCostRule(model).pipe(finalize(() => this.isDisableButton = false)).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordDeletedSuccessfully'),
        });
        this.getCostRuleList();
        this.deleteModalShow = false;
      } else if (res.code == "400") {
        this.messageService.add({
          severity: "error",
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('messageServiceMessages.linkedRecordCannotDelete'),
        });
      } else {
        this.messageService.add({
          severity: "error",
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('messageServiceMessages.recordDeletedFailed'),
        });
      }
    });
  }
}
