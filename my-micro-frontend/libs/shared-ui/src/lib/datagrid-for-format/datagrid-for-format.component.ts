import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    SimpleChanges,
    HostListener,
    ViewChild,
    AfterViewInit,
    OnChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import tr from 'devextreme/localization/messages/tr.json';
import { locale, loadMessages } from 'devextreme/localization';
import { DxDataGridModule, DxDataGridComponent } from 'devextreme-angular';
import { ValueChangedEvent } from 'devextreme/viz/range_selector';
import { ToolbarPreparingEvent } from 'devextreme/ui/data_grid';

@Component({
    selector: 'app-datagrid-for-format',
    standalone: true,
    imports: [CommonModule, DxDataGridModule, TranslateModule],
    templateUrl: './datagrid-for-format.component.html',
    styleUrls: ['./datagrid-for-format.component.scss']
})
export class DatagridForFormatComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() Data: any[] = [];
    @Input() keyExpr?: string;
    @Input() customizeOptions?: any;
    @Input() editColumnsData?: any;
    @Output() setEditColumnsData = new EventEmitter<any>();
    @Input() columns: any[] = [];
    @Input() translation: any; // silinebilir
    @Input() selectedData?: any;
    @Output() setSelectedData = new EventEmitter<any>();

    @Input() customButton: boolean = false;
    @Input() customButtonName?: string;
    @Input() customButtonFunction?: Function;
    @Input() customButtonIcon?: string;
    @Input() buttonList: any;
    @Input() customButtonName2?: string;
    @Output() customButtonReturn = new EventEmitter<any>();

    @Input() customDelete: boolean = false;
    @Output() customDeleteReturn = new EventEmitter<any>();
    @Input() customDeleteName?: string;

    @Input() selectionMode: string = 'single';
    @Input() onClick?: any;
    @Input() export: boolean = true;
    @Input() columnChooser: boolean = true;
    @Input() search: boolean = true;
    @Input() pager: boolean = true;
    @Input() allowedPageSize: number[] = [10, 25, 50, 100];
    @Input() showEditorAlways: boolean = true;

    options: any;
    element?: string;
    prefix?: string | null;

    @Input() selectedRows: any[] = [];
    @Output() setSelectedRows = new EventEmitter<any>();

    selectionChangedBySelectbox?: boolean;
    @Input() dontVisibleColumnsForMultipleSelection?: any;
    isMobile: boolean = false;

    @Input() height: number | string = 700;
    @Input() changedColumns?: any;
    @Output() setChangedColumns = new EventEmitter<any>();

    @Input() customButtonFunction2?: Function;
    @Input() customButtonIcon2?: string;
    @Input() columnName?: any;
    @Output() customButtonReturn2 = new EventEmitter<any>();

    @Input() customButtonName3?: string;
    @Input() customButtonFunction3?: Function;
    @Input() customButtonIcon3?: string;
    @Output() customButtonReturn3 = new EventEmitter<any>();

    @Input() customButtonNameIndex?: string;
    @Input() customButtonFunctionIndex?: Function;
    @Input() customButtonIconIndex?: string;
    @Output() customButtonReturnIndex = new EventEmitter<any>();

    groupedCount = 0;
    @Input() subscriber: boolean = false;
    @Input() dashboard: boolean = false;
    @Input() rowUpdate: boolean = false;
    @Input() rowDelete: boolean = false;
    @Input() rowAdd: boolean = false;
    @Output() rowDeleted = new EventEmitter<any>();
    @Input() showGroupPanel: boolean = true;
    filterCount = 0;
    @Input() disableCustomSearch: boolean = false;

    @ViewChild('dataGrid', { static: false }) dataGrid!: DxDataGridComponent;

    fullDataCopy: any[] = [];
    @Input() gridId?: string;
    storageKey: string | null = null;

    constructor(public translateService: TranslateService) {
        locale("tr");
        loadMessages(tr);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['Data'] && changes['Data'].currentValue) {
            this.fullDataCopy = [...this.Data];
        }
    }

    ngOnInit(): void {
        this.checkScreenWidth();
        this.storageKey = this.gridId ? `dataGridState_${this.gridId}` : null;
    }

    ngAfterViewInit(): void {
        // Here you could do some grid initialization if needed
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        this.checkScreenWidth();
    }

    private checkScreenWidth(): void {
        this.isMobile = window.innerWidth < 768;
    }

    customizeColumns(columns: any) {
        // Implement logic if customColumns is true
    }

    onExporting(e: any) {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Export');

        exportDataGrid({
            component: e.component,
            worksheet,
            autoFilterEnabled: true,
            customizeCell: ({ gridCell, excelCell }) => {
                if (!gridCell || gridCell.rowType !== 'data') return;

                const numberFields = ["potentialRisk", "potentialRiskTRY", "totalAmount", "financialOpening", "financialIncrease",
                    "financialPayment", "financialCancel", "requestedAmount", "amount", "potentialRiskTry", "estimatedRiskLevel"];

                const field = gridCell.column?.dataField;

                if (field && numberFields.includes(field)) {
                    const value = gridCell.value;
                    if (value != null && value !== '') {
                        let numericValue = typeof value === 'number' ? value : Number(value.toString().replace(/\./g, '').replace(',', '.'));
                        if (!isNaN(numericValue)) {
                            numericValue = Math.round((numericValue + Number.EPSILON) * 100) / 100;
                            excelCell.value = numericValue;
                            excelCell.numFmt = '#,##0.00';
                            return;
                        }
                    }
                }
                excelCell.value = gridCell.value;
            }
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer: any) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
            });
        });
        e.cancel = true;
    }

    handlePropertyChange(e: any) {
        if (e.name === "totalCount") {
            this.filterCount = e.value;
        }

        if (e.name === "columns") {
            // Handle column change logic if needed
            this.emitColumnChanges(e.component);
        }

        if (e.name === "selectedRowKeys") {
            this.selectedData = e.value[0];
            this.setSelectedData.emit(this.selectedData);
            this.selectedRows = e.value;
            this.setSelectedRows.emit(this.selectedRows);
        }

        // Check for grouped count
        if (e.component.getDataSource() && e.component.getDataSource()._items) {
            // Simplified grouped count check
        }
    }

    private emitColumnChanges(component: any) {
        const visibleColumns = component.getVisibleColumns();
        const columnsList = visibleColumns
            .filter((col: any) => col.dataField)
            .map((col: any) => ({
                caption: col.caption,
                dataField: col.dataField,
                dataType: col.dataType,
                format: col.format,
                width: col.width
            }));
        this.setChangedColumns.emit(columnsList);
        this.setEditColumnsData.emit(columnsList);
    }

    onRowRemoved(e: any) {
        this.rowDeleted.emit(e.data);
    }

    onClickRow(e: any) {
        if (e.rowType === "data") {
            this.selectedData = e.data;
            this.setSelectedData.emit(this.selectedData);
        }
    }

    onClickDelete = (e: any) => {
        e.event?.preventDefault();
        const grid = e.component;
        const rowIndex = e.row?.rowIndex;
        if (grid && rowIndex !== undefined) {
            grid.deleteRow(rowIndex);
            this.customDeleteReturn.emit(e.row.data);
        }
    }

    onClickCustomButton = (e: any) => {
        e.event.preventDefault();
        this.customButtonReturn.emit(e.row.data);
    }

    onClickCustomButton2 = (e: any) => {
        e.event.preventDefault();
        this.customButtonReturn2.emit(e.row.data);
    }

    onClickCustomButton3 = (e: any) => {
        e.event.preventDefault();
        this.customButtonReturn3.emit(e.row.data);
    }

    onClickCustomButtonIndex = (e: any) => {
        this.customButtonReturnIndex.emit({ data: e.row.data, index: e.row.rowIndex });
    }

    subscriberCell(e: any) {
        if (e.rowType === "data") {
            // Specific logic for subscriber view
            if (e.column.dataField === 'VSTELLE') {
                e.cellElement.style.width = '500px';
            }
        }

        this.onCellPrepared(e);
    }

    onCellPrepared(e: any) {
        if (e.rowType === 'data' && e.column.dataField) {
            if (typeof e.value === "string") {
                const translated = this.translateService.instant(e.value.trim());
                if (translated !== e.value.trim()) {
                    e.cellElement.innerText = translated;
                }
            }
        }
        if (e.rowType === 'group' && e.value) {
            const translatedValue = this.translateService.instant(e.value.toString().trim());
            e.cellElement.innerText = `${e.column.caption}: ${translatedValue}`;
        }
    }

    onRowPrepared(e: any) {
        if (e.rowType === 'data') {
            const rows = e.component.getVisibleRows();
            if (e.rowIndex === rows.length - 1) {
                e.rowElement.classList.add('last-row');
            }
        }
    }

    onRowUpdating(e: any) {
        // Handle complex row update logic if needed
    }

    onRowValidating(e: any) {
        // Handle validation logic
    }

    dataTypeFunc(colm: any) {
        const booleanFields = ["Mandatory", "OutOfUsage", "AtLeast1Mandatory", "ShowCrm", "isDocumentDate"];
        if (booleanFields.includes(colm.caption) || booleanFields.includes(colm.dataField)) {
            return "boolean";
        }
        return colm.dataType || 'string';
    }

    onToolbarPreparing(event: ToolbarPreparingEvent) {
        if (this.disableCustomSearch) return;

        event.toolbarOptions.items?.unshift({
            location: 'after',
            widget: 'dxTextBox',
            options: {
                placeholder: 'Arama...',
                mode: 'search',
                valueChangeEvent: 'keyup',
                onValueChanged: (e: any) => {
                    this.onSearchValueChanged(e.value);
                }
            }
        });
    }

    onSearchValueChanged(value: string) {
        const searchText = (value ?? '').toString().toLocaleLowerCase('tr-TR').trim();
        if (!searchText) {
            this.Data = [...this.fullDataCopy];
            return;
        }
        this.Data = this.fullDataCopy.filter((item: any) => {
            return this.columns.some((col: any) => {
                const val = item[col.dataField];
                return val && String(val).toLocaleLowerCase('tr-TR').includes(searchText);
            });
        });
    }

    calculateFilterExpression(filterValue: any, selectedFilterOperation: any, target: any) {
        return (this as any).defaultCalculateFilterExpression?.apply(this, arguments);
    }

    loadGridState = () => {
        if (this.storageKey) {
            const state = localStorage.getItem(this.storageKey);
            return state ? JSON.parse(state) : null;
        }
        return null;
    };

    saveGridState = (state: any) => {
        if (this.storageKey && state) {
            delete state.selectedRowKeys;
            localStorage.setItem(this.storageKey, JSON.stringify(state));
        }
    };
}
