import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService, GridTranslateService } from '@my-micro-frontend/shared-core';
import { MessageService } from 'primeng/api';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { DatagridForFormatComponent } from '@my-micro-frontend/shared-ui';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-budget-rule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ToolbarModule,
    ButtonModule,
    PanelModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ToastModule,
    DatagridForFormatComponent
  ],
  providers: [MessageService],
  templateUrl: './budget-rule.component.html',
  styleUrls: ['./budget-rule.component.scss']
})
export class BudgetRuleComponent implements OnInit {

  customizeGrid: any;
  customizeGridDetail: any;
  startDate: Date | string | null = null;
  endDate: Date | string | null = null;
  isDisableButton: boolean = false;
  createModalShow = false;
  updateModalShow = false;
  deleteModalShow = false;
  detailModalShow = false;
  showCreateBudgetRuleObjectModal = false;
  showUpdateBudgetRuleObjectModal = false;
  showDeleteBudgetRuleObjectModal = false;
  selectedRow: any = null;
  selectedRowDetail: any = null;
  selectedBudgetRule: any = null;
  data: any[] = [];
  detailData: any[] = [];
  column = [
    {
      dataField: "id",
      caption: "ID",
      width: 80,
      alignment: "left"
    },
    {
      dataField: "ruleName",
      caption: "Kural Adı",
      alignment: "left",
      minWidth: 200
    },
    {
      dataField: "limitAmount",
      caption: "Limit Tutarı",
      width: 120,
      alignment: "left"
    },
    {
      dataField: "currency",
      caption: "Para Birimi",
      width: 130,
      alignment: "left"
    },
    {
      dataField: "startDate",
      caption: "Başlangıç Tarihi",
      format: "dd/MM/yyyy",
      dataType: "date",
      width: 130,
      alignment: "left"
    },
    {
      dataField: "endDate",
      caption: "Bitiş Tarihi",
      format: "dd/MM/yyyy",
      dataType: "date",
      width: 130,
      alignment: "left"
    },
    {
      dataField: "isActive",
      caption: "Durum",
      width: 100
    }
  ];
  currencyList = [
    { name: 'Seçiniz', id: '' },
    { name: 'USD', id: 'USD' },
    { name: 'EUR', id: 'EUR' },
    { name: 'GBP', id: 'GBP' },
    { name: 'TRY', id: 'TRY' }
  ];
  selectedCurrency: any = this.currencyList[0];
  detailColumn = [
    {
      dataField: "id",
      caption: "ID",
      alignment: "left"
    },
    {
      dataField: "objID",
      caption: "Nesne ID",
      alignment: "left"
    },
    {
      dataField: "objType",
      caption: "Nesne Tipi",
      alignment: "left"
    },
    {
      dataField: "dfBudgetRuleId.id",
      caption: "Bütçe Kuralı ID",
      alignment: "left"
    }
  ];
  budgetRuleList: any[] = [];
  newBudgetRuleObject = {
    ObjID: '',
    ObjType: '',
    DfBudgetRuleId: ''
  };
  editBudgetRuleObject = {
    ObjID: '',
    ObjType: ''
  };
  editBudgetRule = {
    RuleName: '',
    LimitAmount: 0,
    Currency: '',
    IsActive: { id: null as boolean | null, name: '' }
  };
  newBudgetRule = {
    RuleName: '',
    LimitAmount: 0,
    Currency: '',
    StartDate: null,
    EndDate: null,
    IsActive: { id: false as boolean | null, name: '' }
  };
  statusList = [
    { name: 'Seçiniz', id: null },
    { name: 'Evet', id: true },
    { name: 'Hayır', id: false }
  ]

  constructor(
    public gridTranslate: GridTranslateService,
    public formService: FormService,
    public messageService: MessageService,
    private translateService: TranslateService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getBudgetRules();
    setTimeout(() => {
      this.customizeGrid = (columns: any[]) => {
        this.gridTranslate.traslateColumns("budgetColumns", columns);
      }
      this.customizeGridDetail = (columns: any[]) => {
        this.gridTranslate.traslateColumns("detailColumn", columns);
      }
    }, 1000);
  }


  getBudgetRules() {
    this.formService.getAllDfBudgetRule().subscribe({
      next: (res: any) => {
        console.log("API Response (getAllDfBudgetRule):", res);


        if (res && res.code == "200") {
          this.data = res.response || res.data || [];
          this.budgetRuleList = this.data.map((item: any) => {
            return { name: item.ruleName || item.RuleName, id: item.id || item.Id };
          });
        } else if (Array.isArray(res)) {
          this.data = res;
          this.budgetRuleList = this.data.map((item: any) => {
            return { name: item.ruleName || item.RuleName, id: item.id || item.Id };
          });
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("API Hatası (getAllDfBudgetRule):", err);
      }
    });
  }

  setSelectedRow(selected: any) {
    this.selectedRow = selected;
  }

  openCreateModalShow() {
    this.createModalShow = true;
    this.newBudgetRule = {
      RuleName: '',
      LimitAmount: 0,
      Currency: '',
      StartDate: null,
      EndDate: null,
      IsActive: { id: false, name: '' }
    };
    this.selectedCurrency = null;
    this.startDate = null;
    this.endDate = null;
  };

  createBudgetRule() {
    if (!this.newBudgetRule.RuleName || this.newBudgetRule.RuleName.trim() === '' ||
        this.newBudgetRule.LimitAmount === null || this.newBudgetRule.LimitAmount === undefined || this.newBudgetRule.LimitAmount === 0 ||
        !this.selectedCurrency || !this.selectedCurrency.id || this.selectedCurrency.id === '' ||
        !this.startDate || !this.endDate ||
        !this.newBudgetRule.IsActive || this.newBudgetRule.IsActive.id === null || this.newBudgetRule.IsActive.id === undefined) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: "Lütfen tüm zorunlu alanları doldurunuz."
      });
    }

    if (this.newBudgetRule.LimitAmount < 0) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('budgetRule.limitAmountValidation')
      });
    }
    if (this.startDate && this.endDate) {
      if (this.startDate > this.endDate) {
        return this.messageService.add({
          severity: "warn",
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('budgetRule.startDateValidation')
        });
      }
    }
    if (this.newBudgetRule.IsActive.id === null || this.newBudgetRule.IsActive.id === undefined) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('budgetRule.statusReq')
      });
    }

    var rule = {
      RuleName: this.newBudgetRule.RuleName,
      LimitAmount: this.newBudgetRule.LimitAmount,
      Currency: this.selectedCurrency.id,
      StartDate: new Date(this.startDate as string).toISOString(),
      EndDate: new Date(this.endDate as string).toISOString(),
      IsActive: this.newBudgetRule.IsActive.id === true,
    };

    this.isDisableButton = true;
    return this.formService.createDfBudgetRule(rule).pipe(finalize(() => this.isDisableButton = false)).subscribe((res: any) => {
      if (res.code == "200") {
        this.newBudgetRule = {
          RuleName: '',
          LimitAmount: 0,
          Currency: '',
          StartDate: null,
          EndDate: null,
          IsActive: { id: null, name: '' }
        };
        this.startDate = null;
        this.endDate = null;
        this.selectedCurrency = null;
        this.createModalShow = false;
        this.getBudgetRules();
        return this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordAddedSuccessfully')
        });
      } else {
        this.messageService.add({
          severity: "error",
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('messageServiceMessages.recordCannotAdded')
        });
      }
    });

  }

  openUpdateModalShow() {
    if (this.selectedRow != null) {
      const selectedStatus = this.statusList.find(s => s.id === this.selectedRow.isActive);
      this.editBudgetRule = {
        RuleName: this.selectedRow.ruleName,
        LimitAmount: this.selectedRow.limitAmount,
        Currency: this.selectedRow.currency,
        IsActive: selectedStatus || this.statusList[0]
      };
      this.selectedCurrency = this.currencyList.find(c => c.id == this.selectedRow.currency)!;
      this.startDate = this.formatDateToInput(this.selectedRow.startDate);
      this.endDate = this.formatDateToInput(this.selectedRow.endDate);
      this.updateModalShow = true;
    } else {
      this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectData'),
      });
    }
  };


  updateBudgetRule() {
    if (!this.editBudgetRule.RuleName || this.editBudgetRule.RuleName.trim() === '' ||
        this.editBudgetRule.LimitAmount === null || this.editBudgetRule.LimitAmount === undefined || this.editBudgetRule.LimitAmount === 0 ||
        !this.selectedCurrency || !this.selectedCurrency.id || this.selectedCurrency.id === '' ||
        !this.startDate || !this.endDate ||
        !this.editBudgetRule.IsActive || this.editBudgetRule.IsActive.id === null || this.editBudgetRule.IsActive.id === undefined) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: "Lütfen tüm zorunlu alanları doldurunuz."
      });
    }

    if (this.editBudgetRule.LimitAmount < 0) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('budgetRule.limitAmountValidation')
      });
    }
    if (this.startDate && this.endDate) {
      if (this.startDate > this.endDate) {
        return this.messageService.add({
          severity: "warn",
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('budgetRule.startDateValidation'),
        });
      }
    }
    if (!this.editBudgetRule.IsActive || this.editBudgetRule.IsActive.id === null || this.editBudgetRule.IsActive.id === undefined) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('budgetRule.statusReq'),
      });
    }
    var rule = {
      RuleName: this.editBudgetRule.RuleName,
      LimitAmount: this.editBudgetRule.LimitAmount,
      Currency: this.selectedCurrency.id,
      Id: this.selectedRow.id,
      IsActive: this.editBudgetRule.IsActive.id === true,
      startDate: new Date(this.startDate as string).toISOString(),
      endDate: new Date(this.endDate as string).toISOString(),
    };
    this.isDisableButton = true;
    return this.formService.updateDfBudgetRule(rule).pipe(finalize(() => this.isDisableButton = false)).subscribe((res: any) => {
      if (res.code == "200") {
        this.updateModalShow = false;
        this.getBudgetRules();
        this.newBudgetRule = {
          RuleName: '',
          LimitAmount: 0,
          Currency: '',
          StartDate: null,
          EndDate: null,
          IsActive: { id: null, name: '' }
        };
        this.selectedCurrency = null;
        this.startDate = null;
        this.endDate = null;
        return this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordUpdatedSuccessfully'),
        });
      } else {
        this.messageService.add({
          severity: "error",
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('messageServiceMessages.recordCannotUpdated'),
        });
      }
    });
  }

  openDeleteModalShow() {
    if (this.selectedRow != null) {
      this.deleteModalShow = true;
    } else {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectData'),
      });
    }
  };

  async deleteBudgetRule() {
    this.isDisableButton = true;
    await this.formService.deleteDfBudgetRule({ Id: this.selectedRow.id }).pipe(finalize(() => this.isDisableButton = false)).subscribe((res: any) => {
      if (res.code == "200") {
        this.deleteModalShow = false;
        this.getBudgetRules();
        return this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordDeletedSuccessfully'),
        });
      } else if (res.code == "400") {
        this.messageService.add({
          severity: "error",
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('messageServiceMessages.linkedRecordCannotDelete'),
        });
      }

      else {
        this.messageService.add({
          severity: "error",
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('messageServiceMessages.recordDeletedFailed'),
        });
      }
    });
  }

  showDetail() {
    if (this.selectedRow != null) {
      this.formService.getDfBudgetRuleObjectsByRuleId(this.selectedRow.id).subscribe((res: any) => {
        if (res.code == "200") {
          this.detailData = res.response;
          this.detailModalShow = true;
          this.selectedBudgetRule = this.budgetRuleList.find(b => b.id == this.selectedRow.id);
        }
      });
    } else {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectData'),
      });
    }
  }

  setSelectedRowDetail(selected: any) {
    this.selectedRowDetail = selected;
  }

  openCreateBudgetRuleObjectModal() {
    this.newBudgetRuleObject = {
      ObjID: '',
      ObjType: '',
      DfBudgetRuleId: ''
    };
    this.showCreateBudgetRuleObjectModal = true;
  }

  createBudgetRuleObject() {
    if (!this.newBudgetRuleObject.ObjID || this.newBudgetRuleObject.ObjID.trim() === '' || 
        !this.newBudgetRuleObject.ObjType || this.newBudgetRuleObject.ObjType.trim() === '') {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: "Lütfen tüm zorunlu alanları doldurunuz."
      });
    }
    var obj = {
      ...this.newBudgetRuleObject,
      DfBudgetRuleId: this.selectedBudgetRule.id
    };
    this.isDisableButton = true;
    return this.formService.createDfBudgetRuleObject(obj).pipe(finalize(() => this.isDisableButton = false)).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordAddedSuccessfully'),
        });
        this.newBudgetRuleObject = {
          ObjID: '',
          ObjType: '',
          DfBudgetRuleId: ''
        };
        this.showCreateBudgetRuleObjectModal = false;
        this.showDetail();
      }
    });

  }

  openUpdateBudgetRuleObjectModal() {
    if (this.selectedRowDetail != null) {
      this.editBudgetRuleObject = {
        ObjID: this.selectedRowDetail.objID,
        ObjType: this.selectedRowDetail.objType
      };
      this.showUpdateBudgetRuleObjectModal = true;
    } else {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectData'),
      });
    }
  }

  updateBudgetRuleObject() {
    if (!this.editBudgetRuleObject.ObjID || this.editBudgetRuleObject.ObjID.trim() === '' || 
        !this.editBudgetRuleObject.ObjType || this.editBudgetRuleObject.ObjType.trim() === '') {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: "Lütfen tüm zorunlu alanları doldurunuz."
      });
    }
    var obj = {
      ObjID: this.editBudgetRuleObject.ObjID,
      ObjType: this.editBudgetRuleObject.ObjType,
      DfBudgetRuleId: this.selectedBudgetRule.id,
      Id: this.selectedRowDetail.id
    };
    this.isDisableButton = true;
    return this.formService.updateDfBudgetRuleObject(obj).pipe(finalize(() => this.isDisableButton = false)).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordUpdatedSuccessfully'),
        });
        this.showUpdateBudgetRuleObjectModal = false;
        this.showDetail();
      }
    });
  }

  openDeleteBudgetRuleObjectModal() {
    if (this.selectedRowDetail != null) {
      this.showDeleteBudgetRuleObjectModal = true;
    } else {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectData'),
      });
    }
  }

  deleteBudgetRuleObject() {
    var obj = {
      Id: this.selectedRowDetail.id
    };
    this.isDisableButton = true;
    return this.formService.deleteDfBudgetRuleObject(obj).pipe(finalize(() => this.isDisableButton = false)).subscribe((res: any) => {
      if (res.code == "200") {
        this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordDeletedSuccessfully'),
        });
        this.showDeleteBudgetRuleObjectModal = false;
        this.showDetail();
      }
    });
  }

  formatDateToInput(date: any) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
