import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { formatDateToInput, FormService } from '@my-micro-frontend/shared-core';
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
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-parameter-type',
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
  templateUrl: './parameter-type.component.html',
  styleUrls: ['./parameter-type.component.scss']
})
export class ParameterTypeComponent implements OnInit {
  customizeGrid: any;
  createModalShow = false;
  selectedRow: any = null;
  selectedForm: any = null;
  updateModalShow = false;
  deleteModalShow = false;
  isDisableButton: boolean = false;
  formList: any = [];
  parameterValueData = [];
  parameterValueListModal = false;
  editParameterTypeData: any = null;
  createParameterValueModalShow = false;
  selectedRowParameterValue: any = null;
  editParameterValueData: any = null;
  updateParameterValueModalShow = false;
  deleteParameterValueModalShow = false;
  customizeGridParameterValue: any;
  startDate: Date | string = "";
  endDate: Date | string = "";
   newParameterValueData = {
    DisplayName: "",
    StartDate: null,
    EndDate: null,
    // isActive: false,
    IsActive: { id: null, name: '' },
    DfFormParameterTypeId: 0,
    Value: "",
    Type: ""
  }
  newParameterTypeData = {
    Name: "",
    Code: "",
    DfSystemCompanyId: 0,
    DFFormId: 0
  }

  data: any[] = [];
  column = [
    {
      dataField: "dfSystemCompanyId",
      caption: "dfSystemCompanyId",
    },
    {
      dataField: "dfFormId",
      caption: "dfFormId",
    },
    {
      dataField: "name",
      caption: "name",
    },
    {
      dataField: "code",
      caption: "code",
    },
  ];
 statusList = [
    { name: 'Seçiniz', id: null },
    { name: 'Evet', id: true },
    { name: 'Hayır', id: false }
  ];
    parameterValueColumn = [
    {
      dataField: "displayName",
      caption: "displayName",
    },
    {
      dataField: "value",
      caption: "value",
    },
    {
      dataField: "type",
      caption: "type",
    },
    {
      dataField: "startDate",
      caption: "startDate",
      format: "dd/MM/yyyy",
      dataType: "date"
    },
    {
      dataField: "endDate",
      caption: "endDate",
      format: "dd/MM/yyyy",
      dataType: "date"
    },
    {
      dataField: "isActive",
      caption: "isActive",
    },
    // {
    //   dataField: "dfFormParameterTypeId.name",
    //   caption: "dfFormParameterTypeId.name",
    // },
  ];

  private formService = inject(FormService);
  private translateService = inject(TranslateService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.getDfFormList();
    this.getParameterList();
    setTimeout(() => {
      const lang = localStorage.getItem('parameterTypeColumns');
      if (lang) {
        this.translateService.setDefaultLang(lang);
        this.translateService.use(lang);
      }
    }, 1000);
   setTimeout(() => {
      const lang = localStorage.getItem('parameterValueColumns');
      if (lang) {
        this.translateService.setDefaultLang(lang);
        this.translateService.use(lang);
      }
    }, 1000);
  }
//#region  Datagrid

   setSelectedRow(selected: any) {
    this.selectedRow = selected;
  }
    setSelectedRowDetail(selected: any) {
    this.selectedRowParameterValue = selected;
  }
  openCreateModalShow() {
    this.createModalShow = true;
    this.newParameterTypeData = {
      Name: "",
      Code: "",
      DfSystemCompanyId: 0,
      DFFormId: 0
    }
    this.selectedForm = null;
  }

  openUpdateModalShow() {
    if (this.selectedRow) {
      this.editParameterTypeData = JSON.parse(JSON.stringify(this.selectedRow));
      this.selectedForm = this.formList.find((f: any) => f.id == this.selectedRow.dfFormId)
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
  openParameterValueListModal() {
    if (this.selectedRow) {
      this.getParameterValueList(this.selectedRow.id);
      this.parameterValueListModal = true;
    } else {
      this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectData'),
      });
    }
  }
   openCreateParameterValueModalShow() {
    this.createParameterValueModalShow = true;
    this.newParameterValueData = {
      DisplayName: "",
      StartDate: null,
      EndDate: null,
      IsActive: { id: null, name: '' },
      DfFormParameterTypeId: 0,
      Value: "",
      Type: ""
    }
    this.startDate = "";
    this.endDate = "";
  }
  //#endregion

  //#region Get Methods
  getParameterValueList(Id: any) {
    this.formService.getParameterValueList(Id).subscribe((res: any) => {
      if (res.code == "200") {
        this.parameterValueData = res.response;
      }
    });
  }
    getParameterList() {
    this.formService.getParameterTypeList().subscribe((res: any) => {
      if (res.code == "200") {
        this.data = res.response;
      }
    });
  }
 openUpdateParameterValueModalShow() {
    if (this.selectedRowParameterValue) {
      // Create a deep copy to prevent datagrid from updating in real-time
      this.editParameterValueData = JSON.parse(JSON.stringify(this.selectedRowParameterValue));
      this.updateParameterValueModalShow = true;
      this.startDate = formatDateToInput(this.editParameterValueData.startDate);
      this.endDate = formatDateToInput(this.editParameterValueData.endDate);
      const selectedStatus = this.statusList.find(s => s.id === this.selectedRowParameterValue.isActive);
      this.editParameterValueData.IsActive = selectedStatus || this.statusList[0];
    } else {
      this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectData'),
      });
    }
  }
  openDeleteParameterValueModalShow() {
    if (this.selectedRowParameterValue) {
      this.deleteParameterValueModalShow = true;
    } else {
      this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('messageServiceMessages.selectData'),
      });
    }
  }
    getDfFormList() {
    this.formService.getAllForm().subscribe((res: any) => {
      if (res.code == "200") {
        this.formList = res.response.map((item: any) => {
          return {
            id: item.id,
            name: item.description
          }
        });
      }
    })
  };
  //#endregion
  //#region Post Methods

   createParameterType() {
    if (this.newParameterTypeData.DfSystemCompanyId == 0 || this.newParameterTypeData.DfSystemCompanyId == null) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.companyReq')
      });
    }
    if (!this.selectedForm) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.formReq')
      });
    }
    if (!this.newParameterTypeData.Name || !this.newParameterTypeData.Name.trim()) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.nameReq')
      });
    }
    if (!this.newParameterTypeData.Code || !this.newParameterTypeData.Code.trim()) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.codeReq')
      });
    }

    this.newParameterTypeData.DFFormId = this.selectedForm.id;
    this.isDisableButton = true;
    this.formService.createParameterType(this.newParameterTypeData).pipe(finalize(() => this.isDisableButton = false)).subscribe((res: any) => {
      if (res.code == "200") {
        this.getParameterList();
        this.createModalShow = false;
        this.newParameterTypeData.Code = ""
        this.newParameterTypeData.Name = ""
        this.selectedForm = null;
        this.newParameterTypeData.DfSystemCompanyId = 0
        return this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordAddedSuccessfully')
        });
      } else {
        return this.messageService.add({
          severity: "error",
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('messageServiceMessages.recordAddedSuccessfully')
        });
      }
    });
  }
    updateParameterType() {
    if (this.newParameterTypeData.DfSystemCompanyId == 0 || this.newParameterTypeData.DfSystemCompanyId == null) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.companyReq')
      });
    }
    if (!this.selectedForm) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.formReq')
      });
    }
    if (!this.newParameterTypeData.Name || !this.newParameterTypeData.Name.trim()) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.nameReq')
      });
    }
    if (!this.newParameterTypeData.Code || !this.newParameterTypeData.Code.trim()) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.codeReq')
      });
    }
    var model = {
      Id: this.editParameterTypeData.id,
      Name: this.editParameterTypeData.name,
      DfSystemCompanyId: this.editParameterTypeData.dfSystemCompanyId,
      Code: this.editParameterTypeData.code,
      DfFormId: this.selectedForm.id
    };
    this.isDisableButton = true;
    this.formService.updateParameterType(model).pipe(finalize(() => this.isDisableButton = false)).subscribe((res: any) => {
      if (res.code == "200") {
        this.getParameterList();
        this.updateModalShow = false;
        return this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordUpdatedSuccessfully'),
        });
      } else {
        return this.messageService.add({
          severity: "error",
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('messageServiceMessages.recordCannotUpdated'),
        });
      }
    });
  }
    deleteParameterType() {
    var model = {
      Id: this.selectedRow.id,
      RuleName: this.selectedRow.ruleName,
      DfSystemCompanyId: this.selectedRow.dfSystemCompanyId
    }
    this.isDisableButton = true;
    this.formService.deleteParameterType(model).pipe(finalize(() => this.isDisableButton = false)).subscribe((res: any) => {
      if (res.code == "200") {
        this.getParameterList();
        this.deleteModalShow = false;
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
        return this.messageService.add({
          severity: "error",
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('messageServiceMessages.recordCannotDeleted'),
        });
      }
    });
  }
    createParameterValue() {
    if (this.newParameterValueData.DisplayName == '') {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.displayNameReq')
      });
    }
    if (this.newParameterValueData.Value == '') {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.parameterValueReq')
      });
    }
    if (this.newParameterValueData.Type == "") {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.parameterValueTypeReq')
      });
    }
    if (this.startDate == null) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.startDateReq')
      });
    }
    if (this.endDate == null) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.endDateReq')
      });
    }
    if (this.startDate >= this.endDate) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.startDateEndDateValidation')
      });
    }
    if (this.newParameterValueData.IsActive.id === null || this.newParameterValueData.IsActive.id === undefined) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.isActiveReq')
      });
    }
    var model = {
      DisplayName: this.newParameterValueData.DisplayName,
      Value: this.newParameterValueData.Value,
      Type: this.newParameterValueData.Type,
      isActive: this.newParameterValueData.IsActive.id,
      StartDate: new Date(this.startDate).toISOString(),
      EndDate: new Date(this.endDate).toISOString(),
      DfFormParameterTypeId: this.selectedRow.id
    }

    this.isDisableButton = true;
    this.formService.createParameterValue(model).pipe(finalize(() => this.isDisableButton = false)).subscribe((res) => {
      if (res.code == "200") {
        this.getParameterValueList(this.selectedRow.id);
        this.createParameterValueModalShow = false;
        this.newParameterValueData = {
          DisplayName: "",
          StartDate: null,
          EndDate: null,
          IsActive: { id: null, name: '' },
          DfFormParameterTypeId: 0,
          Value: "",
          Type: ""
        };
        this.startDate = "";
        this.endDate = "";
        return this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordAddedSuccessfully')
        });
      } else {
        return this.messageService.add({
          severity: "error",
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('messageServiceMessages.recordCannotAdded')
        });
      }
    })
  }
    updateParameterValue() {
    if (this.editParameterValueData.displayName == '') {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.displayNameReq')
      });
    }
    if (this.editParameterValueData.value == '') {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.parameterValueReq')
      });
    }
    if (this.editParameterValueData.type == "") {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.parameterValueTypeReq')
      });
    }
    if (this.startDate == null || this.startDate == "") {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.startDateReq')
      });
    }
    if (this.endDate == null || this.endDate == "") {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.endDateReq')
      });
    }
    if (this.startDate >= this.endDate) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.startDateEndDateValidation')
      });
    }
    if (this.editParameterValueData.IsActive.id === null || this.editParameterValueData.IsActive.id === undefined) {
      return this.messageService.add({
        severity: "warn",
        summary: this.translateService.instant("error"),
        detail: this.translateService.instant('parameterType.isActiveReq')
      });
    }
    var model = {
      Id: this.editParameterValueData.id,
      Value: this.editParameterValueData.value,
      Type: this.editParameterValueData.type,
      isActive: this.editParameterValueData.IsActive.id,
      DisplayName: this.editParameterValueData.displayName,
      StartDate: new Date(this.startDate).toISOString(),
      EndDate: new Date(this.endDate).toISOString(),
      DfFormParameterTypeId: this.selectedRow.id
    }
    this.isDisableButton = true;
    this.formService.updateParameterValue(model).pipe(finalize(() => this.isDisableButton = false)).subscribe((res) => {
      if (res.code == "200") {
        this.getParameterValueList(this.selectedRow.id);
        this.updateParameterValueModalShow = false;
        return this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordUpdatedSuccessfully')
        });
      } else {
        return this.messageService.add({
          severity: "error",
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('messageServiceMessages.recordCannotUpdated')
        });
      }
    })
  }
    deleteParameterValue() {
    var model = {
      Id: this.selectedRowParameterValue.id,
      Value: this.selectedRowParameterValue.value,
      Type: this.selectedRowParameterValue.type,
      isActive: this.selectedRowParameterValue.isActive,
      DisplayName: this.selectedRowParameterValue.displayName,
      StartDate: new Date(this.selectedRowParameterValue.startDate).toISOString(),
      EndDate: new Date(this.selectedRowParameterValue.endDate).toISOString(),
      DfFormParameterTypeId: this.selectedRow.id
    }
    this.isDisableButton = true;
    this.formService.deleteParameterValue(model).pipe(finalize(() => this.isDisableButton = false)).subscribe((res) => {
      if (res.code == "200") {
        this.getParameterValueList(this.selectedRow.id);
        this.deleteParameterValueModalShow = false;
        this.selectedRowParameterValue = null;
        return this.messageService.add({
          severity: "success",
          summary: this.translateService.instant("success"),
          detail: this.translateService.instant('messageServiceMessages.recordDeletedSuccessfully')
        });
      } else {
        return this.messageService.add({
          severity: "error",
          summary: this.translateService.instant("error"),
          detail: this.translateService.instant('messageServiceMessages.recordCannotDeleted')
        });
      }
    })
  }
  //#endregion
}
