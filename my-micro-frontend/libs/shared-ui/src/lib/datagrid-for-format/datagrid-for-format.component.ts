import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DxDataGridModule, DxButtonModule, DxTextBoxModule } from 'devextreme-angular';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import tr from 'devextreme/localization/messages/tr.json';

import { locale, loadMessages } from 'devextreme/localization';
import { ToolbarPreparingEvent } from 'devextreme/ui/data_grid';
import { DxDataGridComponent } from 'devextreme-angular';
import { ValueChangedEvent } from 'devextreme/viz/range_selector';

@Component({
    selector: 'app-datagrid-for-format',
    standalone: true,
    imports: [
        CommonModule,
        DxDataGridModule,
        DxButtonModule,
        DxTextBoxModule,
        TranslateModule
    ],
    templateUrl: './datagrid-for-format.component.html',
    styleUrl: './datagrid-for-format.component.scss'
})
export class DatagridForFormatComponent implements OnInit {

    @Input() Data: any = [];
    @Input() keyExpr!: string;
    @Input() customizeOptions!: any;
    @Input() editColumnsData!: any;
    @Output() setEditColumnsData = new EventEmitter<any>();
    @Input() columns: any = [];
    @Input() translation: any; //silinecek
    @Input() selectedData!: any;
    @Input() editingMode: string = 'cell';
    @Output() setSelectedData = new EventEmitter<any>();

    @Input() detailHeader: any;
    @Input() detailColumns: any;
    @Input() detailDataField: string = 'items';

    @Input() customButton: any;
    @Input() customButtonName: any;
    @Input() customButtonFunction!: Function;
    @Input() customButtonIcon: any;
    @Input() customButtonClass: string = '';
    @Input() customButtonVisible: any;
    @Input() buttonList: any;
    @Input() customButtonName2: any;
    @Output() customButtonReturn = new EventEmitter<any>();

    @Input() customDelete: any;
    @Output() customDeleteReturn = new EventEmitter<any>();
    @Input() customDeleteName: any;


    @Input() selectionMode!: any;
    @Input() onClick!: any;
    @Input() export: boolean = true;
    @Input() columnChooser: boolean = true;
    @Input() search: boolean = true;
    @Input() pager: boolean = true;
    @Input() allowedPageSize: number[] = [10, 25, 50, 100];
    @Input() showEditorAlways: boolean = true;
    @Input() pageSize: number = 25;
    options: any;
    element!: string;
    prefix!: string | null;
    public auto: any = 'auto';
    public save: string = 'save';
    public Sil: string = 'Sil';
    public searchIcon: string = 'search';

    @Input() selectedRows: any[] = [];
    @Output() setSelectedRows = new EventEmitter<any>();
    selectionChangedBySelectbox!: boolean;
    @Input() dontVisibleColumnsForMultipleSelection!: any;
    isMobile: boolean | undefined;
    @Input() height: any;
    @Input() changedColumns!: any;
    @Output() setChangedColumns = new EventEmitter<any>();
    @Input() customButtonFunction2!: Function;
    @Input() customButtonIcon2: any;
    @Input() columnName: any;
    @Input() code: any;
    @Output() customButtonReturn2 = new EventEmitter<any>();
    @Input() customButtonName3!: Function;
    @Input() customButtonFunction3!: Function;
    @Input() customButtonIcon3: any;
    @Output() customButtonReturn3 = new EventEmitter<any>();

    @Input() customButtonNameIndex!: Function;
    @Input() customButtonFunctionIndex!: Function;
    @Input() customButtonIconIndex: any;
    @Output() customButtonReturnIndex = new EventEmitter<any>();
    groupedCount = 0;
    @Input() autoExpandAll: boolean = true;
    @Input() subscriber: boolean = false;
    @Input() dashboard: boolean = false;
    @Input() rowUpdate: boolean = false;
    @Input() rowDelete: boolean = false;
    @Input() rowAdd: boolean = false;
    @Output() rowDeleted = new EventEmitter<any>();
    @Input() showGroupPanel: boolean = true;
    filterCount = 0;
    public translate!: TranslateService;
    @Input() disableCustomSearch: boolean = false;
    @ViewChild('dataGrid', { static: false }) dataGrid!: DxDataGridComponent;
    fullDataCopy: any;
    @Input() gridId?: string; // isteğe bağlı: dışarıdan grid kimliği alır
    storageKey?: string;

    get isStateStoringEnabled(): boolean {
        return !!this.storageKey;
    }
    constructor(public translateService: TranslateService) {
        // setTimeout(() => {
        //   this.fullDataCopy = this.Data;
        // }, 1000);
        this.translateService.addLangs(["tr", "en"]);
        locale("tr");
        loadMessages(tr);
    }
    ngOnChanges(changes: SimpleChanges): void {
    }
    ngOnInit(): void {
        if (this.height == undefined) {
            this.height = 700;
        }
        this.checkScreenWidth();

        this.translate = this.translateService;
        this.fullDataCopy = this.Data;

        this.storageKey = this.gridId
            ? `dataGridState_${this.gridId}`
            : undefined;
    }
    ngAfterViewInit(): void {
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        this.checkScreenWidth();
    }

    private checkScreenWidth(): void {
        this.isMobile = window.innerWidth < 768; //mobile
    }

    customizeColumns(columns: any) {
    }

    onExporting(e: any) { // for excel export
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Product');

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
                        let numericValue = Number(
                            value
                                .toString()
                                .replace(/\./g, '')
                                .replace(',', '.')
                        );

                        if (!isNaN(numericValue)) {
                            numericValue = Math.round((numericValue + Number.EPSILON) * 100) / 100;

                            excelCell.value = numericValue;
                            excelCell.numFmt = '#,##0.00';
                            return;
                        } else {
                            excelCell.value = gridCell.value;
                        }
                    } else {
                        excelCell.value = gridCell.value;
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
        if (!e.component) return;
        this.filterCount = e.component.totalCount();


        if (typeof this.editColumnsData != 'undefined') {
            if (e.name === "columns" && typeof e.value === "number") {
                this.groupedCount = e.component.instance ? (e.component.instance()._controllers?.data?._dataSource?._cachedData?.extra?.groupCount || 0) : 0;
                this.setEditColumnsData.emit(e);
                var match = e.fullName.match(/(\d+)/);
                var columnsList = [];
                for (const iterator of e.component.getVisibleColumns()) {
                    if (iterator.headerId) {
                        columnsList.push({ caption: iterator.caption, dataField: iterator.dataField, dataType: iterator.dataType, format: iterator.format, width: iterator.width })
                    }
                }
                this.setChangedColumns.emit(columnsList);
                //this.editColumnsData.group.push(this.columns[match[0]].name);
            }
            if (e.name === "columns" && typeof e.previousValue === "number") {
                this.setEditColumnsData.emit(e);
                var match = e.fullName.match(/(\d+)/);
                var columnsList = [];
                for (const iterator of e.component.getVisibleColumns()) {
                    if (iterator.headerId) {
                        columnsList.push({ caption: iterator.caption, dataField: iterator.dataField, dataType: iterator.dataType, format: iterator.format, width: iterator.width })
                    }
                }
                this.setChangedColumns.emit(columnsList);
                //this.editColumnsData.group.push(this.columns[match[0]].name);
            }
            if (e.name === "columns" && typeof e.value === "boolean") {
                this.setEditColumnsData.emit(e);
                var match = e.fullName.match(/(\d+)/);
                var columnsList = [];
                for (const iterator of e.component.getVisibleColumns()) {
                    if (iterator.headerId) {
                        columnsList.push({ caption: iterator.caption, dataField: iterator.dataField, dataType: iterator.dataType, format: iterator.format, width: iterator.width })
                    }
                }
                this.setChangedColumns.emit(columnsList);
                //this.editColumnsData.columns.push(this.columns[match[0]].name);
            }
        }
        if (e.name === "selectedRowKeys") {
            this.selectedData = e.value[0]
            this.setSelectedData.emit(this.selectedData);
            this.selectedRows = e.value
            this.setSelectedRows.emit(this.selectedRows);
        }
        if (e.fullName && e.fullName.includes('visibleIndex') == true) {
            var columnsList = [];
            for (const iterator of e.component.getVisibleColumns()) {
                if (iterator.headerId) {
                    columnsList.push({ caption: iterator.caption, dataField: iterator.dataField, dataType: iterator.dataType, format: iterator.format, width: iterator.width })
                }
            }
            this.setChangedColumns.emit(columnsList);
        }
        if (e.component && e.component._controllers && e.component._controllers.data && e.component._controllers.data._dataSource) {
            if (e.component._controllers.data._dataSource._cachedData && e.component._controllers.data._dataSource._cachedData.extra) {
                this.groupedCount = e.component._controllers.data._dataSource._cachedData.extra.groupCount ? e.component._controllers.data._dataSource._cachedData.extra.groupCount : 0;
            }
        }

    }
    selectionChangedHandler() {
        if (!this.selectionChangedBySelectbox) {
            this.prefix = null;
        }
        this.selectionChangedBySelectbox = false;
    }

    onRowRemoved(e: any) {
        this.rowDeleted.emit(e.data); // dışarıya fırlat
        // Burada silinen kayda göre başka işlemler yapabilirsin
    }

    onSelectionChanged(e: any) {
        if (e && e.selectedRowKeys) {
            this.selectedRows = e.selectedRowKeys;
            this.setSelectedRows.emit(this.selectedRows);
            this.selectedData = e.selectedRowsData ? e.selectedRowsData[0] : null;
            this.setSelectedData.emit(this.selectedData);
        }
    }

    onRowUpdated(e: any) {
        // Row updated handler
    }

    onContextMenuPreparing(e: any) {
        // Context menu handler
    }

    onEditingStart(e: any) {
        if (!this.dataGrid || !this.dataGrid.instance) return;
        const rowIndex = this.dataGrid.instance.getRowIndexByKey(e.key);
        const rowCount = this.Data ? this.Data.length : 0;

        if (rowIndex === rowCount - 1 && this.rowAdd) {
            this.dataGrid.instance.addRow();
        }
    }

    onClickRow(e: any) {
        if (e.rowType === "data") {
            // if (this.selectedData == e.data) {
            //   this.selectedData = null;
            //   e.component.clearSelection();
            //   return this.setSelectedData.emit(this.selectedData);
            // }
            this.selectedData = e.data
            this.setSelectedData.emit(this.selectedData);
        }
    }

    onClickDelete = (e: any) => {
        e.event?.preventDefault();

        const grid = e.component;
        const rowIndex = e.row?.rowIndex;


        if (!grid || rowIndex === undefined) return;

        if (this.customDelete) {
            grid.option('editing.texts.confirmDeleteMessage',
                'Bu işlem gerçekleştirildiğinde dosyanız silinecektir, onaylıyor musunuz?'
            );

            const observer = new MutationObserver(() => {
                const buttons = document.querySelectorAll('.dx-dialog-button .dx-button-text');
                if (buttons.length === 2) {
                    const yesBtn = buttons[0].closest('.dx-button') as HTMLElement;
                    const noBtn = buttons[1] as HTMLElement;

                    if (noBtn.textContent === 'Hayır') noBtn.textContent = 'İptal';

                    if (yesBtn) {
                        yesBtn.style.backgroundColor = '#dc3545';
                        yesBtn.style.borderColor = '#dc3545';
                        yesBtn.style.color = '#fff';
                    }

                    observer.disconnect();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            grid.option('editing.texts.confirmDeleteMessage',
                'Bu kaydı silmek istediğinize emin misiniz?'
            );
        }


        // 1) En sağlıklı yol: yerleşik deleteRow (editing.allowDeleting=true olmalı)
        if (typeof grid?.deleteRow === 'function' && rowIndex !== undefined) {
            grid.deleteRow(rowIndex); // confirmDelete açıksa uyarı çıkar
            // İstersen parent'a da haber ver:
            this.customDeleteReturn.emit(e.row.data);
            return;
        }


    }


    onClickCustomButton = (e: any) => {
        e.event?.preventDefault();
        this.customButtonReturn.emit(e.row.data);
    }

    onClickCustomButton2 = (e: any) => {
        e.event?.preventDefault();
        this.customButtonReturn2.emit(e.row.data);
    }

    onClickCustomButton3 = (e: any) => {
        e.event?.preventDefault();
        this.customButtonReturn3.emit(e.row.data);
    }

    onClickCustomButtonIndex = (e: any) => {
        const data = e.row.data;
        const index = e.row.rowIndex;

        this.customButtonReturnIndex.emit({ data, index });
    }


    subscriberCell(e: any) {
        if (e.rowType === "data") {
            if (e.data.EINZDATFARK === "X" && e.columnIndex == 4 && e.data.EndUserContractDateDb != "0001-01-01T00:00:00") {
                e.cellElement.style.backgroundColor = "red";
            }
            if (e.data.SONONAYTRHFARK === "X" && e.columnIndex == 5 && e.data.FinalProjectApprovalDateDb != "0001-01-01T00:00:00") {
                e.cellElement.style.backgroundColor = "red";
            }
            if (e.data.SONKONTTRHFARK === "X" && e.columnIndex == 6 && e.data.LastGasOpeningDateDb != "0001-01-01T00:00:00") {
                e.cellElement.style.backgroundColor = "red";
            }
            if (e.data.SONACMATRHFARK === "X" && e.columnIndex == 7 && e.data.LastInstallationControlDateDb != "0001-01-01T00:00:00") {
                e.cellElement.style.backgroundColor = "red";
            }

            if (e.column.dataField === 'VSTELLE') {
                e.cellElement.style.width = '500px';
                e.cellElement.style.maxWidth = '500px';
            }

            if (e.column.dataField === 'STRING23') {
                e.cellElement.style.width = '20px';
                e.cellElement.style.maxWidth = '20px';
                // e.cellElement.style.height= '200px';
                e.cellElement.style.whiteSpace = "normal";
                e.cellElement.style.overflowWrap = "break-word";
                e.cellElement.innerHTML = e.cellElement.innerHTML.replaceAll(",", "<br/>\r\n")
            }
            if (e.column.dataField === 'STRING01') {
                e.cellElement.style.width = '20px';
                e.cellElement.style.maxWidth = '20px';
                // e.cellElement.style.height= '200px';
                e.cellElement.style.whiteSpace = "normal";
                e.cellElement.style.overflowWrap = "break-word";
            }
            if (e.values && e.values[0] == "Toplam:") {
                if (e.column.dataField === 'TeamName') {
                    e.cellElement.style.fontWeight = 'bold';
                }
                if (e.column.dataField === 'Received') {
                    e.cellElement.style.fontWeight = 'bold';
                }
                if (e.column.dataField === 'OnTheField') {
                    e.cellElement.style.fontWeight = 'bold';
                }
                if (e.column.dataField === 'Opened') {
                    e.cellElement.style.fontWeight = 'bold';
                }
                if (e.column.dataField === 'NotOpened') {
                    e.cellElement.style.fontWeight = 'bold';
                }
            }
        }

        if (e.rowType === 'data' && e.column.dataField) {

            if (typeof e.value === "string") {

                const translatedValue = this.translateService.instant(e.value.trim());
                e.cellElement.innerText = translatedValue;

            }



        }


        if (e.rowType === 'group' && e.value) {
            const translatedValue = this.translateService.instant(e.value.toString().trim());
            e.cellElement.innerText = `${e.column.caption}: ${translatedValue}`;
        }
        //   if (rowInfo.TUKNO == 'KOLON')
        //     rowElement.css('background', 'red');
    }

    // onRowValidating(e) {
    //   const oldData = e.oldData;
    //   const newData = e.newData;
    //   if (newData.hasOwnProperty('txtDGOpenAmount') ||
    //     newData.hasOwnProperty('txtDGIncrease') ||
    //     newData.hasOwnProperty('txtDGCancel') ||
    //     newData.hasOwnProperty('txtDGPayoff') ||
    //     newData.hasOwnProperty('lstDGOpenQuarter')
    //     || newData.hasOwnProperty('lstDGOpenQuarter')) {


    //   }
    //   debugger;
    //   // if(e.newData.Email) {
    //   //     e.promise = this.checkEmail(e.newData.Email)
    //   //         .then((result: any) => {
    //   //             // "result" is { errorText: "The Email address you entered already exists.", isValid: false }
    //   //             e.errorText = result.errorText;
    //   //             e.isValid = result.isValid;
    //   //         });
    //   // }
    // }
    getGridData(): any[] {
        // 1. Commit edilmemiş verileri commit ettir
        this.dataGrid.instance.closeEditCell();

        // 2. Commit’ten sonra alınan veriler kesin güncel olur
        const rows = this.dataGrid.instance.getVisibleRows();
        const data = rows.map((row: any) => row.data);
        return data;
    }
    onRowValidating(e: any) {

        const newData = { ...e.oldData, ...e.newData }; // hem eski hem yeni veriye eriş

        if (
            newData.hasOwnProperty('lstDGOpenYear') ||
            newData.hasOwnProperty('lstDGOpenQuarter')
        ) {
            const newYear = newData.lstDGOpenYear;
            const newQuarter = newData.lstDGOpenQuarter;

            const isDuplicate = this.Data.some((item: any) => {
                return (
                    item.lstDGOpenYear === newYear &&
                    item.lstDGOpenQuarter === newQuarter &&
                    !(item.lstDGOpenYear === e.oldData.lstDGOpenYear &&
                        item.lstDGOpenQuarter === e.oldData.lstDGOpenQuarter)
                );
            });

            if (isDuplicate) {
                e.isValid = false;
                e.errorText = 'Bu yıl ve çeyrek zaten mevcut!';
            }

            const txtDGOpenAmount = Number(newData.txtDGOpenAmount || 0);
            const txtDGIncrease = Number(newData.txtDGIncrease || 0);
            const txtDGCancel = Number(newData.txtDGCancel || 0);
            const txtDGPayoff = Number(newData.txtDGPayoff || 0);

            const calculatedCurrent = txtDGOpenAmount + txtDGIncrease - txtDGPayoff - txtDGCancel;

            // Güncellenen satırın index'ini bul
            const rowIndex = this.Data.findIndex((item: any) =>
                item.lstDGOpenYear === e.oldData.lstDGOpenYear &&
                item.lstDGOpenQuarter === e.oldData.lstDGOpenQuarter
            );

            if (rowIndex > 0) {
                const previousRow = this.Data[rowIndex - 1];
                const previousCurrent = Number(previousRow.current || 0);

                if (e.newData.hasOwnProperty('txtDGOpenAmount') && calculatedCurrent !== previousCurrent) {
                    e.isValid = false;
                    e.errorText = 'Yeni açılış, bir önceki satırın güncel değeriyle aynı olmalı!';
                }
            }
        }



    }

    onRowUpdating(e: any) {
        const oldData = e.oldData;
        const newData = e.newData;

        // Satırın index'ini bul
        const currentIndex = this.Data.findIndex((item: any) =>
            item.lstDGOpenYear === oldData.lstDGOpenYear &&
            item.lstDGOpenQuarter === oldData.lstDGOpenQuarter
        );

        // Sayıya güvenli çeviren yardımcı fonksiyon
        const toNumber = (val: any): number => {
            const n = Number(val);
            return isNaN(n) ? 0 : n;
        };

        if (
            newData.hasOwnProperty('txtDGOpenAmount') ||
            newData.hasOwnProperty('txtDGIncrease') ||
            newData.hasOwnProperty('txtDGCancel') ||
            newData.hasOwnProperty('txtDGPayoff')
        ) {
            // Güncellenen satır için verileri topla
            let txtDGOpenAmount = toNumber(oldData.txtDGOpenAmount);
            let txtDGIncrease = toNumber(oldData.txtDGIncrease);
            let txtDGCancel = toNumber(oldData.txtDGCancel);
            let txtDGPayoff = toNumber(oldData.txtDGPayoff);

            if (newData.hasOwnProperty('txtDGOpenAmount')) {
                txtDGOpenAmount = toNumber(newData.txtDGOpenAmount);
            }
            if (newData.hasOwnProperty('txtDGIncrease')) {
                txtDGIncrease = toNumber(newData.txtDGIncrease);
            }
            if (newData.hasOwnProperty('txtDGCancel')) {
                txtDGCancel = toNumber(newData.txtDGCancel);
            }
            if (newData.hasOwnProperty('txtDGPayoff')) {
                txtDGPayoff = toNumber(newData.txtDGPayoff);
            }

            // Yeni current hesapla
            const newCurrent = txtDGOpenAmount + txtDGIncrease - txtDGPayoff - txtDGCancel;
            newData.current = newCurrent;
            e.component.cellValue(e.rowIndex, 'current', newCurrent);

            let previousCurrent = newCurrent;

            for (let i = currentIndex + 1; i < this.Data.length; i++) {
                const row = this.Data[i];

                row.txtDGOpenAmount = previousCurrent;

                const increase = toNumber(row.txtDGIncrease);
                const cancel = toNumber(row.txtDGCancel);
                const payoff = toNumber(row.txtDGPayoff);

                const updatedCurrent = previousCurrent + increase - payoff - cancel;
                row.current = updatedCurrent;

                e.component.cellValue(i, 'txtDGOpenAmount', previousCurrent);
                e.component.cellValue(i, 'current', updatedCurrent);

                previousCurrent = updatedCurrent;
            }
        }
    }


    // onRowUpdating(e) {
    //   const oldData = e.oldData;
    //   const newData = e.newData;


    //   if (newData.hasOwnProperty('txtDGOpenAmount') ||
    //     newData.hasOwnProperty('txtDGIncrease') ||
    //     newData.hasOwnProperty('txtDGCancel') ||
    //     newData.hasOwnProperty('txtDGPayoff')) {
    //     let txtDGOpenAmount: number = Number(oldData.txtDGOpenAmount);
    //     let txtDGIncrease: number = Number(oldData.txtDGIncrease);
    //     let txtDGCancel: number = Number(oldData.txtDGCancel);
    //     let txtDGPayoff: number = Number(oldData.txtDGPayoff);

    //     if (newData.hasOwnProperty('txtDGOpenAmount')) {
    //       txtDGOpenAmount = Number(newData.txtDGOpenAmount);
    //     }

    //     if (newData.hasOwnProperty('txtDGIncrease')) {
    //       txtDGIncrease = Number(newData.txtDGIncrease);
    //     }

    //     if (newData.hasOwnProperty('txtDGCancel')) {
    //       txtDGCancel = Number(newData.txtDGCancel);
    //     }

    //     if (newData.hasOwnProperty('txtDGPayoff')) {
    //       txtDGPayoff = Number(newData.txtDGPayoff);
    //     }

    //     debugger;
    //     const current = txtDGOpenAmount + txtDGIncrease - txtDGPayoff - txtDGPayoff;
    //     newData.current = current;

    //     e.component.cellValue(e.rowIndex, 'current', newData.current);


    //   }

    // }



    onRowPrepared(e: any) {

        const rows = e.component.getVisibleRows();
        if (e.rowIndex === rows.length - 1) e.rowElement.classList.add('last-row');



    }



    dataTypeFunc(colm: any) {
        if (colm.caption == "Mandatory" || colm.caption == "OutOfUsage" || colm.caption == "AtLeast1Mandatory" || colm.caption == "ShowCrm" || colm.caption == "isDocumentDate") {
            return "boolean"
        }
        return colm.dataType
    }
    // onCellPrepared(e) {

    //   if (e.rowType === 'data' && e.column.dataField) {

    //     if (typeof e.value === "string") {

    //       if (e.value != null) {
    //         // const translatedValue = this.translateService.instant(e.value.trim());

    //         if (e.value != null) {
    //           if (e.value != false) {


    //             const translatedValue = this.translateService.instant(e.value.trim());




    //             e.cellElement.innerText = translatedValue;

    //             e.cellElement.innerText = translatedValue;



    //             if (e.rowType === 'data') {

    //               if (e.rowType === 'data') {


    //                 const rowIndex = e.component.getRowIndexByKey(e.key); // Satır indeksini al



    //                 if (rowIndex !== -1) {

    //                   if (rowIndex !== -1) {

    //                     this.Data[rowIndex][e.column.dataField] = translatedValue;

    //                     this.Data[rowIndex][e.column.dataField] = translatedValue;

    //                   }

    //                 }

    //               }

    //             }

    //           }
    //         }
    //       }

    //     }



    //     // debugger;


    //   }



    //   if (e.rowType === 'group') {

    //     if (e.value != null && typeof e.value === "string") {
    //       const translatedValue = this.translateService.instant(e.value.trim());

    //       if (e.value != null) {
    //         if (e.value != false) {
    //           const translatedValue = this.translateService.instant(e.value.trim());



    //           e.cellElement.innerText = `${e.column.caption}: ${translatedValue}`;

    //           e.cellElement.innerText = `${e.column.caption}: ${translatedValue}`;

    //         }

    //       }
    //     }

    //   }
    // }

    onCellPrepared(e: any) {
        if (e.rowType === 'data' && e.column.dataField) {

            if (e.column.dataField.includes(".")) {
                if (e.value != null) {
                    const translatedValue = this.translateService.instant(e.value);
                    e.cellElement.innerText = translatedValue;
                }
            }
        }

        if (e.rowType === 'group') {
            if (e.column && e.column.dataField === 'journeyId') {
                for (let i = 0; i < e.cellElement.childNodes.length; i++) {
                    const node = e.cellElement.childNodes[i];
                    if (node.nodeType === 3 && node.nodeValue) {
                        if (e.value === 999999999 || e.value === '999999999') {
                            node.nodeValue = 'Diğer Masraf Fişleri';
                        }
                    }
                }

                if (e.value === 999999999 || e.value === '999999999') {
                    e.cellElement.style.color = '#d97706';
                } else {
                    e.cellElement.style.color = '#16a34a';
                }
                e.cellElement.style.fontWeight = 'bold';
            } else {
                if (e.value != null && typeof e.value === "string") {
                    const translatedValue = this.translateService.instant(e.value.trim());
                    e.cellElement.innerText = `${e.column.caption}: ${translatedValue}`;
                }
            }
        }
    }

    calculateCellValue(rowData: any) {
        let column = this as any;

        // let strx :string= rowData[column.dataField];
        // strx = this.translate.instant(rowData[column.dataField] );

        return rowData[column.dataField] + "-ek";
    }

    onCellValueChanged(e: any) {
        // Değişen hücreyi kontrol et
        if (e.column.dataField === 'txtDGOpenAmount' ||
            e.column.dataField === 'txtDGIncrease' ||
            e.column.dataField === 'txtDGCancel' ||
            e.column.dataField === 'payment') {

            const rowData = e.data; // Satırdaki tüm veriler
            const txtDGOpenAmount = rowData.txtDGOpenAmount || 0;
            const txtDGIncrease = rowData.txtDGIncrease || 0;
            const txtDGCancel = rowData.txtDGCancel || 0;
            const payment = rowData.payment || 0;

            const current = txtDGOpenAmount + txtDGIncrease - txtDGCancel - payment;

            // current hücresini güncelle
            e.component.cellValue(e.rowIndex, 'current', current);
        }
    }

    // onEditorPreparing(e: any) {
    //   if (e.parentType === 'dataRow' && e.dataField === 'current') {
    //     const rowData = e.row.data; 

    //     if (rowData.increase !== undefined) {
    //       e.editorOptions.value = rowData.increase;  
    //     }
    //   }
    // }

    // onSearchValueChanged(value: any) {
    //   const columns = this.dataGrid.instance.getVisibleColumns();
    //   const searchValue = String(value || "").toLocaleLowerCase("tr-TR");

    //   this.Data = this.fullDataCopy.filter(m => {
    //     return columns.some(i => {
    //       const fieldValue = m[i.dataField];
    //       if (fieldValue === null || fieldValue === undefined) {
    //         return false;
    //       }

    //       const strValue = String(fieldValue).toLocaleLowerCase("tr-TR");
    //       return strValue.includes(searchValue);
    //     });
    //   });
    // }

    onToolbarPreparing(event: ToolbarPreparingEvent) {
        if (this.disableCustomSearch) {
            return;
        }
        event.toolbarOptions.items = event.toolbarOptions.items || [];
        event.toolbarOptions.items?.unshift({
            location: 'after',
            widget: 'dxTextBox',
            options: {
                placeholder: 'Arama...',
                mode: 'search',
                valueChangeEvent: 'keyup',
                onValueChanged: (e: ValueChangedEvent) => {
                    this.onSearchValueChanged(e.value);
                }
            }
        });
    }

    //tr search


    onSearchValueChanged(value: any) {
        if (this.fullDataCopy.length === 0) {
            this.fullDataCopy = [...this.Data];
        }
        const searchText = (value ?? '').toString().toLocaleLowerCase('tr-TR').trim();

        if (!searchText) {
            this.Data = [...this.fullDataCopy];
            return;
        }
        this.Data = [...this.fullDataCopy]; //silerken de araması için eklendi.
        this.Data = this.Data.filter((m: any) => {
            return this.columns.some((i: any) => {
                const field = i?.dataField;
                if (!field) return false;

                const cellValue = m[field];
                if (cellValue === null || cellValue === undefined) return false;

                // Her türlü veriyi güvenli şekilde stringe çevir
                const strValue = String(cellValue).toLocaleLowerCase('tr-TR');
                return strValue.includes(searchText);
            });
        });
    }

    //end 


    //begin: row filter

    calculateFilterExpression(filterValue: any, selectedFilterOperation: any, target: any) {
        let column = this as any;
        const uiOp = selectedFilterOperation || 'contains';
        if (filterValue) {
            let selector = (data: any) => {
                let applyOperation = (arg1: any, arg2: any, op: any) => {

                    const a = typeof arg1 === 'string'
                        ? arg1.toLocaleLowerCase('tr-TR').trim()
                        : arg1;

                    const b = typeof arg2 === 'string'
                        ? arg2.toLocaleLowerCase('tr-TR').trim()
                        : arg2;

                    switch (op) {
                        case '=':
                            return a === b;
                        case 'startswith':
                            return typeof a === 'string' && typeof b === 'string' && a.startsWith(b);
                        case 'endswith':
                            return typeof a === 'string' && typeof b === 'string' && a.endsWith(b);
                        case 'contains':
                        default:
                            return typeof a === 'string' && typeof b === 'string' && a.includes(b);
                    }

                    // if (op === "contains") return arg1.toLocaleLowerCase('tr-TR').trim().includes(arg2.toLocaleLowerCase('tr-TR').trim());
                    // if (op === "=") return arg1.toLocaleLowerCase('tr-TR').trim() === arg2.toLocaleLowerCase('tr-TR').trim();

                    // if (op === "startswith") return arg1.toLocaleLowerCase('tr-TR').trim().startsWith(arg2.toLocaleLowerCase('tr-TR').trim());
                    // if (op === "endswith") return arg1.toLocaleLowerCase('tr-TR').trim().endsWith(arg2.toLocaleLowerCase('tr-TR').trim());
                };
                let values = column.calculateCellValue(data);
                let arr = Array.isArray(values) ? values : (values != null ? [values] : []);



                return arr.some(v => applyOperation(v, filterValue, selectedFilterOperation));
            };
            return [selector, uiOp, true];
        }
        const def = (this as any).defaultCalculateFilterExpression;
        return def ? def.apply(this, arguments) : null;
    }

    loadGridState = () => {
        if (!this.storageKey) return null;
        const savedState = localStorage.getItem(this.storageKey);
        const state = savedState ? JSON.parse(savedState) : null;
        if (state) {
            delete state.selectedRowKeys;
        }
        return state;
    };

    saveGridState = (state: any) => {
        if (this.storageKey != null) {
            if (state) {
                delete state.selectedRowKeys;
                localStorage.setItem(this.storageKey, JSON.stringify(state));
            }
        }
    };

    //end
}