import { ChangeDetectorRef, Component, Input, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, FormControl, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { DatagridForFormatComponent } from '@my-micro-frontend/shared-ui';
import { AccordionModule } from 'primeng/accordion';
import { SelectModule } from 'primeng/select';
import { InputMaskModule } from 'primeng/inputmask';
import { DatePickerModule } from 'primeng/datepicker';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormService, GeneralSystemService } from '@my-micro-frontend/shared-core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { API } from 'libs/shared-core/src/lib/constants/form/API';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    DatagridForFormatComponent,
    TranslateModule,
    AccordionModule,
    SelectModule,
    InputMaskModule,
    DatePickerModule,
    FileUploadModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    InputTextModule,
    FloatLabelModule,
    ProgressSpinnerModule
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
  providers: [MessageService]
})
export class DynamicFormComponent implements OnInit {
  @ViewChildren('editablegrid') editableGrids!: QueryList<DatagridForFormatComponent>;

  fields: any[] = [];
  fieldValues: { [key: string]: any } = {};
  previewUrl: string | ArrayBuffer | null = null;
  formName: string = "";
  trFormId: any = null;
  dfFormId: any = null;
  fileName: any;
  fileSize: any;
  visibleFile: boolean = false;
  uploadedFileGuid: any;
  disabledFields: { [key: string]: boolean } = {};
  showFileDialogVisible: boolean = false;
  image: any;
  user: any;
  postData: any;
  isLoading: boolean = true;

  selectedRows: any[] = [];
  dynamicColumns: any[] = [];
  updateDfFormId: any = null;
  buttonIsVisible: boolean = false;
  editableDynamicColumns: any[] = [];

  forms: any[] = [];
  selectedAmounts = 0;
  oldAmounts = 0;
  amountRule = 0;
  difference = false;
  private internalForms: any[] = [];
  overAmount = 0;

  dfForm = null;
  reportedDate = new Date();

  validationModel = null;
  activeTabs: any[] = [];
  isDark: boolean = false;
  private themeObserver!: MutationObserver;

  constructor(
    private cdRef: ChangeDetectorRef,
    private formService: FormService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private generalService: GeneralSystemService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.selectedRows = nav?.extras?.state?.['selectedRows'] || [];
    this.overAmount = nav?.extras?.state?.['overAmount'] || 0;
    this.reportedDate = nav?.extras?.state?.['reportedDate'] || new Date();

    this.getUser();
  }

  getEditableGridByCode(code: string): DatagridForFormatComponent | undefined {
    return this.editableGrids.find(grid => (grid as any).code === code);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cdRef.detectChanges();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
  }

  resetFormState(): void {
    this.forms = [];
    this.formName = '';
    this.buttonIsVisible = false;
    this.editableDynamicColumns = [];
    this.dfFormId = null;
    this.trFormId = null;
    // this.internalForms = [];
    // this.fieldValues = {};
    // this.dynamicColumns = [];
    // this.selectedRows = [];
    // this.disabledFields = {};
    // this.uploadedFileGuid = null;
  }

  ngOnInit(): void {
    this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    this.themeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          this.isDark = document.documentElement.getAttribute('data-theme') === 'dark';
          this.cdRef.detectChanges();
        }
      });
    });
    this.themeObserver.observe(document.documentElement, { attributes: true });

    this.route.paramMap.subscribe(params => {
      this.resetFormState();
      this.isLoading = true;
      this.dfFormId = params.get('dfformid');
      this.trFormId = params.get('trformid');

      if (this.trFormId == null) {
        this.formService.getDfFormById(this.dfFormId).subscribe({
          next: (res: any) => {
            console.log(res);
            try {
              if (res.response && res.response.length > 0) {
                this.dfForm = res.response[0].dfForm;
                this.validationModel = res.response[0].dfFormFieldValidation;

                res.response.forEach((formItem: any) => {
                  this.createDynamicForm(formItem);
                });
              }
              this.buttonIsVisible = true;
              console.log("Final forms array:", this.forms);
            } catch (err) {
              console.error("Error creating dynamic form:", err);
            } finally {
              this.isLoading = false;
              this.cdRef.detectChanges();
            }
          },
          error: () => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          }
        });
      } else {
        this.formService.getTrFormById(Number(this.trFormId)).subscribe({
          next: (res: any) => {
            if (res.response && res.response.length > 0) {
              this.dfFormId = res.response[0].dfform.dfForm.id;
              res.response.forEach((formItem: any) => {
                if (this.user && this.user.id == formItem.trForm.userId) {
                  if (formItem.trForm.dfFormStatusId != 3 && formItem.trForm.dfFormStatusId != 2) {
                    this.buttonIsVisible = true;
                  }
                }

                this.formName = formItem.dfform.dfForm.description || '';
                this.createDynamicForm(formItem.dfform);
                this.getData(formItem.trForm.formValues);
              });
            }
            this.isLoading = false;
            this.cdRef.detectChanges();
          },
          error: () => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          }
        });
      }
    });
  }

  getUser() {
    return this.generalService.getUserRedis().subscribe(async (res: any) => {
      if (res.code !== "99") {
        this.user = res.response;
        console.log("user", this.user);
      }
    })
  }

  getData(data: any): void {
    try {
      const parsed = JSON.parse(data);
      const formValues = Array.isArray(parsed) ? parsed[0] : parsed;

      this.forms.forEach((form: any) => {
        form.fields.forEach((field: any) => {
          const code = field.code;
          const id = field.id;

          if (formValues.hasOwnProperty(code)) {
            let value = formValues[code];
            if (field.type === 'Date' && typeof value === 'string') {
              value = new Date(value);
            }
            if (field.type === 'FileUpload') {
              this.uploadedFileGuid = value;
              this.previewUrl = API.baseContent + `${this.uploadedFileGuid}`;
            }

            if (field.type === 'EditableDatagrid') {
              if (!field.rows) field.rows = [];

              if (value.length > 0) {
                const parsedValues = JSON.parse(value);
                parsedValues.forEach((item: any) => {
                  const isDuplicate = field.rows.some((existing: any) => existing.id === item.id);
                  if (!isDuplicate) field.rows.push(item);
                });
              }
            }

            if (field.type === 'Datagrid') {
              if (value.length > 0) {
                if (!field.rows) field.rows = [];
                const parsed = value;
                const addedColumns = new Set<string>();
                let sampleRow: any = null;

                if (Array.isArray(parsed) && parsed.length > 0) {
                  sampleRow = parsed[0];
                } else if (parsed && typeof parsed === 'object') {
                  sampleRow = parsed;
                }

                if (sampleRow) {
                  Object.keys(sampleRow).forEach(key => {
                    if (!addedColumns.has(key)) {
                      this.dynamicColumns.push({
                        dataField: key,
                        caption: key.charAt(0).toUpperCase() + key.slice(1)
                      });
                      addedColumns.add(key);
                    }
                  });
                }
                this.selectedRows = value;
              }
            }
            this.fieldValues[id] = value;
          }
        });
      })
    } catch (err) {
      console.error('getData parse error:', err);
    }
  }

  createDynamicForm(data: any): void {
    data.dfFormFields.forEach((field: any) => {
      const newField = { ...field };

      try {
        newField.config = field.configData ? JSON.parse(field.configData) : {};
      } catch {
        newField.config = {};
      }

      if (['EditableDatagrid'].includes(field.type)) {
        let parsed: any = newField.definedData;
        const addedColumns = new Set<string>();
        addedColumns.add(field.code);
        if (typeof parsed === 'string') {
          try {
            parsed = JSON.parse(parsed);
          } catch (e) {
            parsed = {};
          }
        }
        if (parsed?.data?.values) {
          this.editableDynamicColumns = parsed?.data?.values || [];
        } else {
          if (!newField.rows) newField.rows = [];
          if (this.selectedRows && this.selectedRows.length > 0) {
            newField.rows = [...this.selectedRows];
          }

          if (field.btcDfFormFieldsRowDto && Array.isArray(field.btcDfFormFieldsRowDto) && field.btcDfFormFieldsRowDto.length > 0) {
            if (!newField.dynamicColumns) newField.dynamicColumns = [];
            this.editableDynamicColumns = [];
            field.btcDfFormFieldsRowDto.forEach((row: any) => {
              const key = row.code;
              const label = row.name;
              const sortOrder = row.sortOrder;

              if (key && !addedColumns.has(key)) {
                let column: any = { dataField: key, caption: label, sortOrder: sortOrder };

                if (row.type?.toLowerCase() === 'dropdown') {
                  if (row.definedData) {
                    try {
                      const parsed = typeof row.definedData === 'string' ? JSON.parse(row.definedData) : row.definedData;
                      const values = parsed?.data?.values;
                      if (Array.isArray(values) && values.length > 0) {
                        column.lookup = { dataSource: values, valueExpr: 'value', displayExpr: 'label' };
                        column.editorType = 'dxSelectBox';
                        column.placeholder = "Seçiniz";
                      }
                    } catch (err) { }
                  }
                }

                if (row.type?.toLowerCase() === 'date') {
                  column.editorType = 'dxDateBox';
                  column.dataType = 'date';
                  column.format = 'dd.MM.yyyy';
                }

                if (row.type?.toLowerCase() === 'checkbox') {
                  column.editorType = 'dxCheckBox';
                  column.dataType = 'boolean';
                }

                this.editableDynamicColumns.push(column);
                this.editableDynamicColumns.sort((a, b) => a.sortOrder - b.sortOrder);
                addedColumns.add(key);
              }
            });

            newField.dynamicColumns.push(this.editableDynamicColumns);
            newField.dynamicColumns.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
            newField.dynamicColumns = newField.dynamicColumns.flat();
          }
        }
      }

      if (['Datagrid'].includes(field.type)) {
        if (this.selectedRows && this.selectedRows.length > 0) {
          if (!newField.dynamicColumns) newField.dynamicColumns = [];
          const parsed = this.selectedRows;
          const addedColumns = new Set<string>();
          let sampleRow: any = null;

          if (Array.isArray(parsed) && parsed.length > 0) sampleRow = parsed[0];
          else if (parsed && typeof parsed === 'object') sampleRow = parsed;

          if (sampleRow) {
            Object.keys(sampleRow).forEach(key => {
              if (!addedColumns.has(key)) {
                this.dynamicColumns.push({ dataField: key, caption: key.charAt(0).toUpperCase() + key.slice(1) });
                addedColumns.add(key);
              }
            });
          }

          newField.dynamicColumns.push(this.dynamicColumns);
          newField.dynamicColumns = newField.dynamicColumns.flat();
          this.fieldValues[field.id] = this.selectedRows;
        }
      }

      if (['DropDown', 'RadioButton', 'CheckBox'].includes(field.type)) {
        try {
          newField.relatedField = field.relatedField;
          newField.parentRelatedField = field.parentRelatedField;
          if (field.apiUrl && field.apiUrl.trim() !== "") {
            let queryParams = new HttpParams();
            if (field.importValues != null && field.importValues !== undefined && field.importValues.trim() !== '') {
              let unescaped = field.importValues.replace(/^"|"$/g, '');
              let jsonImportValues = JSON.parse(unescaped);
              let count = 0;
              let unescapedParameter = field.importParameter.replace(/^"|"$/g, '');
              let jsonImportParameter = JSON.parse(unescapedParameter);

              for (let item of jsonImportValues) {
                queryParams = queryParams.append(item, jsonImportParameter[count]);
                count++;
              }
            }
            this.formService.getFieldDataByUrlWithParams(field.apiUrl, queryParams).subscribe({
              next: (res: any) => {
                let parsed: any = res?.response;
                if (typeof parsed === 'string') parsed = JSON.parse(parsed);
                newField.options = parsed || [];

                if ((!newField.options || newField.options.length === 0) && field.definedData) {
                  let defParsed: any = field.definedData;
                  if (typeof defParsed === 'string') defParsed = JSON.parse(defParsed);
                  if (typeof defParsed === 'string') defParsed = JSON.parse(defParsed);
                  newField.options = defParsed?.data?.values || [];
                }
                this.cdRef.detectChanges();
              },
              error: (err: any) => {
                console.error("API error for DropDown options:", err);
                if (field.definedData) {
                  let defParsed: any = field.definedData;
                  if (typeof defParsed === 'string') defParsed = JSON.parse(defParsed);
                  if (typeof defParsed === 'string') defParsed = JSON.parse(defParsed);
                  newField.options = defParsed?.data?.values || [];
                  this.cdRef.detectChanges();
                }
              }
            });
          } else if (field.definedData) {
            let parsed: any = field.definedData;
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
            newField.options = parsed?.data?.values || [];
          }
        } catch (error) {
          newField.options = [];
        }
      }

      if (this.isVisible(newField)) {
        let form: any;
        const targetDfForm = newField.dfForm || data.dfForm;

        if (newField.rowFormId == 0) {
          form = this.forms.find((f: any) => f.id === targetDfForm.id);
          if (!form) {
            form = { id: targetDfForm.id, formName: data.dfForm.description, fields: [] };
            this.forms.push(form);
          }
          form.fields.push(newField);
          form.fields.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
        }

        if (newField.rowFormId != 0 && newField.type !== "Form") {
          form = this.forms.find((f: any) => f.id === targetDfForm.id);
          if (!form) {
            form = { id: targetDfForm.id, formName: data.dfForm.description, fields: [] };
            this.internalForms.push(form);
            this.forms.push(form);
          }
          form.fields.push(newField);
          form.fields.sort((a: any, b: any) => a.sortOrder - b.sortOrder);
        }
      }
    })
    this.activeTabs = this.forms.map((_, i) => i);
  }

  onDynamicChange(controlName: string, event: any) {
    this.formService.getDfFormFieldsByFieldId(Number(controlName)).subscribe((res: any) => {
      let field: any = res?.response?.[0];
      if (!field) return;

      let form = this.forms.find(f => f.id === field.dfForm?.id);
      let tfield = form?.fields?.find((f: any) => f.id === Number(controlName));

      if (tfield && field.apiUrl && field.apiUrl.trim() !== "") {
        let queryParams = new HttpParams();
        queryParams = queryParams.append(field.importValues, Number(event.value));
        this.formService.getFieldDataByUrlWithParams(field.apiUrl, queryParams).subscribe((res: any) => {
          let parsed: any = res?.response;
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          tfield.options = parsed || [];
        });
      }
    });
  }

  getPropertyTypeNames(field: any): string {
    const names = field.btcDfFormFieldsRoleProperties?.map((p: any) => p.dfPropertyType?.name).filter(Boolean);
    return names?.join(', ') || '';
  }

  isRequired(field: any): boolean {
    return field.btcDfFormFieldsRoleProperties?.some((p: any) => p.dfPropertyType?.name === 'Is_Required');
  }

  isDisabled(field: any): boolean {
    const isRoleDisabled = field.btcDfFormFieldsRoleProperties?.some((p: any) => p.dfPropertyType?.name === 'Is_Disable');
    const isUploaded = this.disabledFields[field.id];
    return isRoleDisabled || isUploaded;
  }
  isVisible(field: any): boolean {
    const props = field.btcDfFormFieldsRoleProperties || [];
    return !props.some((p: any) => p.dfPropertyType?.name === 'Is_Visible');
  }

  getFieldWidth(field: any): string {
    let classes = 'col-12'; // Default base class for mobile
    try {
      if (field.configData) {
        const config = JSON.parse(field.configData);
        const size = config.size || 'md';
        const width = config.width || 12;

        classes += ` ${size}:col-${width}`;

        if (config.offset !== undefined && config.offset !== null) {
          classes += ` ${size}:col-offset-${config.offset}`;
        }
        if (config.push !== undefined && config.push !== null) {
          classes += ` ${size}:col-push-${config.push}`;
        }
        if (config.pull !== undefined && config.pull !== null) {
          classes += ` ${size}:col-pull-${config.pull}`;
        }
      } else {
        classes += ' md:col-12';
      }
    } catch {
      classes += ' md:col-12';
    }
    return classes;
  }

  getFieldSpace(field: any): number {
    try {
      const config = JSON.parse(field.configData);
      return config.spacingAfter || 0;
    } catch {
      return 0;
    }
  }

  hasValidationError(): boolean {
    for (const form of this.forms) {
      for (const field of form.fields) {
        const value = this.fieldValues[field.id];
        const isRequired = field.btcDfFormFieldsRoleProperties?.some((p: any) => p.dfPropertyType?.name === 'Is_Required');
        const isEmpty = value === null || value === undefined || value === '';

        if (isRequired && isEmpty) return true;
        if (this.hasBackendValidationError(field)) return true;
      }
    }
    return false;
  }

  save(form: NgForm) {
    if (!form.valid) return;
    if (this.hasValidationError()) return;

    let rows: any[] = [];
    const result: { [key: string]: any } = {};

    this.forms.forEach(form => {
      form.fields.forEach((field: any) => {
        const fieldId = field.id;
        const fieldCode = field.code;
        if (['EditableDatagrid'].includes(field.type)) {
          const grid = this.getEditableGridByCode(field.code);
          if (grid) {
            const data = (grid as any).getGridData();
            if (data !== null && data !== undefined) {
              result[fieldCode] = JSON.stringify(data);
            }
            rows = data;
          }
        }
        if (['Datagrid'].includes(field.type)) {
          result[fieldCode] = this.selectedRows;
        }

        if (['FileUpload'].includes(field.type)) {
          result[fieldCode] = this.uploadedFileGuid;
        }

        if (this.fieldValues.hasOwnProperty(fieldId.toString()) && field.type != "Date") {
          result[fieldCode] = this.fieldValues[fieldId];
        }
        if (field.type == "Date" && this.fieldValues[fieldId]) {
          const d = new Date(this.fieldValues[fieldId]);
          const fixedDate = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
          result[fieldCode] = fixedDate.toISOString();
        }
      });
    })

    var model: any = {
      formValues: JSON.stringify([result]),
      userId: this.user ? this.user.id : 1,
      userName: 'test',
      dfFormId: this.dfFormId,
      relatedFormId: 0,
      id: null,
      GrossTotalAmount: rows.reduce((total, item) => total + (parseFloat(item.fiyat) || 0), 0),
      TotalAmount: rows.reduce((total, item) => total + this.withoutKDVAmount(parseFloat(item.fiyat || 0), parseFloat(item.kdvOrani || 0)), 0),
      OverAmount: this.overAmount,
      ReportedDate: new Date()
    };

    if (this.trFormId != null) {
      model.id = this.trFormId;
      model.dfFormId = this.dfFormId;
    }
    this.selectedAmounts = this.selectedRows.reduce((total, item) => total + (item.amount || 0), 0);

    if (this.reportedDate.getTime() !== new Date().getTime()) {
      model.ReportedDate = this.reportedDate;
    }

    this.formService.saveTrForm(model).subscribe((res: any) => {
      if (res.code != "99") {
        this.messageService.add({ severity: 'success', summary: this.translateService.instant("success"), detail: this.translateService.instant("success") });
        window.location.reload();
      } else {
        return this.messageService.add({ severity: 'error', summary: this.translateService.instant("error"), detail: this.translateService.instant(res.errorCode.toString()) })
      }
    })
  }

  getFieldValidationByCode(code: string) {
    return (this.validationModel as any)?.find((v: any) => v.code === code);
  }

  hasBackendValidationError(field: any): boolean {
    if (!this.validationModel || !field?.code) return false;

    const validation = this.getFieldValidationByCode(field.code);
    if (!validation) return false;

    let value = this.fieldValues[field.id];
    if (typeof value === 'number') value = value.toString();

    return validation.validations.some((rule: any) => {
      switch (rule.ruleType) {
        case 'Required': return value === null || value === undefined || value === '';
        case 'MaxLength': return value && value.length > +rule.ruleValue;
        case 'MinLength': return value && value.length < +rule.ruleValue;
        case 'Pattern': return value && !new RegExp(rule.ruleValue).test(value);
        case 'MinLength&MaxLength': return value && value.length != parseInt(rule.ruleValue);
        default: return false;
      }
    });
  }

  getBackendValidationMessage(field: any): string | null {
    const validation = this.getFieldValidationByCode(field.code);
    if (!validation) return null;

    const value = this.fieldValues[field.id];

    for (const rule of validation.validations) {
      const hasError = (() => {
        switch (rule.ruleType) {
          case 'Required': return value === null || value === undefined || value === '';
          case 'MaxLength': return value && value.length > +rule.ruleValue;
          case 'MinLength': return value && value.length < +rule.ruleValue;
          case 'Pattern': return value && !new RegExp(rule.ruleValue).test(value);
          case 'MinLength&MaxLength': return value && value.length != parseInt(rule.ruleValue);
          default: return false;
        }
      })();

      if (hasError) return rule.message;
    }
    return null;
  }

  withoutKDVAmount(amount: number, kdvRate: number): number {
    var kdvAmount = (amount * kdvRate) / 100
    return amount - kdvAmount;
  }

  onFileSelect = async (event: any, field: any): Promise<void> => {
    this.visibleFile = true;
    this.fileName = event.currentFiles[0].name;
    this.fileSize = event.currentFiles[0].size;
    const file: File = event.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => { this.previewUrl = reader.result; };
      reader.readAsDataURL(file);
    }

    let uploadedFile = [];
    if (event.files.length > 0) {
      for (let file of event.files) {
        uploadedFile.push({
          FileName: file.name,
          FileSource: await this.toBase64(file)
        });
      }
    } else {
      uploadedFile.push({ FileName: "", FileSource: "" });
    }
    this.formService.saveOrUpdateUplaodedFile(uploadedFile[0]).subscribe((res: any) => {
      if (res.code == '200') {
        const guid = res.response;
        this.fieldValues[field.id] = guid;
        this.disabledFields[field.id] = true;
        if (this.trFormId != null) this.uploadedFileGuid = "";
      }
    })
  }

  toBase64 = async (file: any): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  showFile() {
    this.showFileDialogVisible = true;
  }

  setFaturaTutari(data: any) {
    this.forms.forEach(form => {
      form.fields.forEach((field: any) => {
        if (field.code === 'amount') {
          this.fieldValues[field.id] = data.faturaTutari;
        }
        if (field.code === 'date') {
          const rawDate = data.date;
          if (rawDate != undefined) {
            if (rawDate.includes('/')) {
              const [day, month, year] = rawDate.split('/');
              this.fieldValues[field.id] = new Date(+year, +month - 1, +day);
            }
            if (rawDate.includes('.')) {
              const [day, month, year] = rawDate.split('.');
              this.fieldValues[field.id] = new Date(+year, +month - 1, +day);
            }
          }
        }
        if (field.code === 'fisDetay') {
          if (data.items != undefined) this.selectedRows = data.items;
          else if (data.urunler != undefined) this.selectedRows = data.urunler;

          if (!field.rows) field.rows = [];
          field.rows.push(this.selectedRows);
          field.rows = field.rows.flat();
        }
      });
    })
  }

  setFiles(data: any) {
    let uploadedFile = [{ FileName: data.fileName, FileSource: data.file }];
    this.forms.forEach(form => {
      form.fields.forEach((field: any) => {
        if (field.code === 'file') {
          this.formService.saveOrUpdateUplaodedFile(uploadedFile[0]).subscribe((res: any) => {
            if (res.code == '200') {
              const guid = res.response;
              this.fieldValues[field.id] = guid;
              this.disabledFields[field.id] = true;
              if (this.trFormId != null) this.uploadedFileGuid = "";
            }
          })
        }
      })
    })
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
  }
}
