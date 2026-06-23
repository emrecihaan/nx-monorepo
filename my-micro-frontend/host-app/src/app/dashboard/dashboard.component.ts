import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { DatagridForFormatComponent } from '@my-micro-frontend/shared-ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BreadcrumbService, FormService, GeneralSystemService, GridTranslateService, ConfigService } from '@my-micro-frontend/shared-core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

enum SubMenuIdList {
    RequestsPendingApproval = 1 //Onay Bekleyen Talepler
}
export enum TrFormStatusId {
    Item = 0,
    New = 1,
    WaitingForApproval = 2,
    Approved = 3,
    Rejected = 4
}
export interface AppConfig {
    inputStyle?: string;
    dark?: boolean;
    theme?: string;
    ripple?: boolean;
}
@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ToolbarModule,
        PanelModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        DatagridForFormatComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    providers: [ConfigService, MessageService]
})
export class DashboardComponent implements OnInit {

    lineChartData: any;
    lineChartOptions: any;
    selectedYear: any;
    activeNews = 1;
    selectedCar: any;
    subscription: Subscription;
    config: AppConfig;
    detailHeader: string = "Detay Verisi";
    subMenuList: any[] = [];
    selectedRows: any[] = [];
    selectedRow: any;
    data: any[] = [];
    column = [
        {
            dataField: "id",
            caption: "id",
        },
        {
            dataField: "dfForm.description",
            caption: "dfForm.description",
        },
        {
            dataField: "userName",
            caption: "userName",
        },
        {
            dataField: "formApplyCycle",
            caption: "formApplyCycle",
        },
        {
            dataField: "statusName",
            caption: "statusName",
        }
    ]
    detailColumn = [
        {
            dataField: "approverName",
            caption: "Onaycı Adı",
        },
        {
            dataField: "createdDate",
            caption: "Oluşturma Tarihi",
        },
        {
            dataField: "dfFormStatusName",
            caption: "Durum",
        },
        {
            dataField: "rejectReason",
            caption: "Reddedilme Nedeni",
        },
        {
            dataField: "trFormId",
            caption: "FormId",
        },

    ]
    customizeGrid: any;
    user: any = null;
    selectedCardId: number = 1;
    constructor(
        private breadcrumbService: BreadcrumbService,
        public configService: ConfigService,
        public formService: FormService,
        private gridTranslate: GridTranslateService,
        public generalService: GeneralSystemService,
        public translateService: TranslateService,
        private router: Router,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef
    ) {

        this.breadcrumbService.setItems([
            { label: 'Dashboard', routerLink: ['/'] }
        ]);


        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
            this.updateChartOptions();
        });
        //this.getFormList();
    }


    colorFunc(item: any) {
        if (item.isActive == true) {
            return 'orange'
        }
        return '#00325D'
    }


    ngOnInit() {

        setTimeout(() => {
            this.subMenuList = [
                {
                    icon: "pi pi-wallet",
                    name: "requestsPendingCorrection",
                    isActive: false,
                    color: "#00325D",
                    type: "New",
                    id: 1
                },
                {
                    icon: "pi pi-search",
                    name: "requestsPendingApproval",
                    isActive: false,
                    color: "orange",
                    type: "WaitingForApproval",
                    id: 2
                },
                {
                    icon: "pi pi-times-circle",
                    name: "rejectedRequests",
                    isActive: false,
                    color: "red",
                    type: "Rejected",
                    id: 4
                },
                {
                    icon: "pi pi-check-circle",
                    name: "approvedRequests",
                    isActive: false,
                    color: "green",
                    type: "Approved",
                    id: 3
                },
            ];
            this.getUser();
            this.cdr.detectChanges();
        }, 1000);

        setTimeout(() => {
            const storedLanguage = localStorage.getItem('languageKey');
            console.log(storedLanguage);
            this.customizeGrid = (columns: any[]) => {
                this.gridTranslate.traslateColumns("formListColumns", columns);
            }
            this.cdr.detectChanges();
        }, 1000);

    }
    updateChartOptions() {
        if (this.config.dark)
            this.applyDarkTheme();
        else
            this.applyLightTheme();
    }

    applyDarkTheme() {
        this.lineChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        display: false
                    }
                },
            }
        };
    }

    applyLightTheme() {
        this.lineChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        display: false
                    }
                },
            }
        };
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    setSelectedRows(value: any) {
        this.selectedRows = value;
    }

    getFormList() {
        return this.formService.getAllForm().subscribe((res) => {
            if (res.code != "99") {
                this.data = res.response;
            }
        })
    }

    // getFormListByUserId(userId) {
    //     return this.formService.getUserFormList(userId).subscribe((res) => {
    //         if (res.code != "99") {
    //             this.data = res.response.map((r) => {
    //                 return { ...r, statusName: this.translateService.instant(TrFormStatusId[r.dfFormStatusId]) }
    //             })
    //         }
    //     })
    // }

    getFormCount(userId: any) {
        return this.formService.getUserFormCount(userId).subscribe((res: any) => {
            if (res.code != "99") {
                var list = [];
                for (const element of this.subMenuList) {
                    var isIn = res.response.find((s: any) => s.type == element.type);
                    if (isIn != undefined) {
                        list.push({ ...element, number: isIn.count });
                    }

                }
                this.subMenuList = list;
                this.cdr.detectChanges();
            }
        })
    }

    getUser() {
        return this.generalService.getUserRedis().subscribe(async (res: any) => {
            if (res.code !== "99") {
                this.user = res.response;
                if (this.user && this.user.id) {
                    this.getFormCount(this.user.id);
                    // this.getFormListByUserId(this.user.id);
                    this.getFormListWithStatusIdAndUserId(SubMenuIdList.RequestsPendingApproval, this.user.id);
                }
                this.cdr.detectChanges();
            }
        })
    }

    getFormListWithStatusIdAndUserId(statusId: any, userId: any) {
        this.selectedCardId = statusId;
        return this.formService.getFormListWithStatusIdAndUserId(statusId, userId).subscribe(async (res: any) => {
            if (res.code !== "99") {
                this.data = res.response.map((r: any) => {
                    const createdDate = new Date(r.createdDate);
                    const formattedDate = `${String(createdDate.getDate()).padStart(2, '0')}/${String(createdDate.getMonth() + 1).padStart(2, '0')}/${createdDate.getFullYear()}`;
                    return {
                        ...r,
                        statusName: this.translateService.instant(TrFormStatusId[r.dfFormStatusId]),
                        createdDate: formattedDate
                    }
                })
                this.cdr.detectChanges();
            }
        })
    }

    goDetail() {
        if (this.selectedRows.length > 1) {
            return this.messageService.add({
                severity: 'warn',
                summary: this.translateService.instant('messageServiceMessages.missingValue'),
                detail: this.translateService.instant('messageServiceMessages.selectOneDataDetail')
            });
        }
        if (this.selectedRows.length != 0) {
            this.selectedRows.map((selectedRow) => {
                this.router.navigate(['/app/form-app/dynamic-form', 0, selectedRow.id]);
            })
        }
        else {
            this.messageService.add({
                severity: 'warn',
                summary: this.translateService.instant("warning"),
                detail: this.translateService.instant("fieldWarning")
            });
        }
    }

    sendApprove() {
        if (this.selectedRows.length == 0) {
            return this.messageService.add({
                severity: 'warn',
                summary: this.translateService.instant('messageServiceMessages.missingValue'),
                detail: this.translateService.instant('messageServiceMessages.selectData')
            });
        }
        const trFormIdDtoList = this.selectedRows.map(selectedRow => ({ id: selectedRow.id }))
        console.log(trFormIdDtoList);
        this.formService.sendApprove(trFormIdDtoList).subscribe((res: any) => {
            if (res.code != "99") {
                this.getFormListWithStatusIdAndUserId(SubMenuIdList.RequestsPendingApproval, this.user.id);
                this.getFormCount(this.user.id);
            } else {
                return this.messageService.add({
                    severity: 'error',
                    summary: this.translateService.instant('error'),
                    detail: this.translateService.instant('messageServiceMessages.sentForApproval')
                });
            }
        })
    }

    async downloadPdf() {
        if (this.selectedRows.length == 0) {
            return this.messageService.add({
                severity: 'warn',
                summary: this.translateService.instant('messageServiceMessages.missingValue'),
                detail: this.translateService.instant('messageServiceMessages.selectData')
            });
        }
        try {
            const rows = this.selectedRows;

            const getByPath = (obj: any, path: string) => {
                if (!path) return '';
                const parts = path.split('.');
                let cur = obj;
                for (const p of parts) {
                    if (cur == null) return null;
                    cur = cur[p];
                }
                return cur;
            };

            const escapeHtml = (s: any) => {
                if (s === null || s === undefined) return '';
                const str = String(s);
                return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            };

            const renderValue = (v: any) => {
                if (v === null || v === undefined) return '';
                if (Array.isArray(v)) {
                    if (v.length === 0) return '';
                    if (v.every(x => typeof x !== 'object')) {
                        return '<ul>' + v.map(x => `<li>${escapeHtml(x)}</li>`).join('') + '</ul>';
                    }
                    const keys = Array.from(v.reduce((acc: Set<string>, cur: any) => { Object.keys(cur || {}).forEach((k: string) => acc.add(k)); return acc; }, new Set<string>())) as string[];
                    let t = '<table style="border-collapse:collapse;width:100%;">';
                    t += '<thead><tr>' + keys.map(k => `<th style="border:1px solid #ddd;padding:4px;background:#f7f7f7">${escapeHtml(k)}</th>`).join('') + '</tr></thead>';
                    let tbody = '<tbody>';
                    for (const row of v) {
                        tbody += '<tr>';
                        for (const k of keys) {
                            const raw = getByPath(row, k) ?? '';
                            tbody += '<td style="border:1px solid #ddd;padding:4px">' + escapeHtml(String(raw)) + '</td>';
                        }
                        tbody += '</tr>';
                    }
                    tbody += '</tbody>';
                    t += tbody;
                    t += '</table>';
                    return t;
                }
                if (typeof v === 'object') {
                    const keys = Object.keys(v);
                    let objTable = '<table style="border-collapse:collapse;width:100%;">';
                    objTable += '<tbody>';
                    for (const k of keys) {
                        const raw = getByPath(v, k) ?? '';
                        objTable += `<tr><th style="text-align:left;padding:4px;border:1px solid #eee;background:#fafafa">${escapeHtml(k)}</th><td style="padding:4px;border:1px solid #eee">${escapeHtml(String(raw))}</td></tr>`;
                    }
                    objTable += '</tbody></table>';
                    return objTable;
                }
                return escapeHtml(v);
            };

            const configuredFields: { path: string, caption: string }[] = [];
            const humanize = (p: string) => {
                if (!p) return p;
                const last = p.split('.').pop() || p;
                const words = last.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_\.]/g, ' ').split(' ');
                return words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            };

            const getCaptionForPath = (path: string) => {
                if (!path) return '';
                const tx1 = this.translateService.instant(`formListColumns.${path}`);
                if (tx1 && tx1 !== `formListColumns.${path}`) return tx1;
                const tx2 = this.translateService.instant(`formListDetailColumns.${path}`);
                if (tx2 && tx2 !== `formListDetailColumns.${path}`) return tx2;
                const tx3 = this.translateService.instant(path);
                if (tx3 && tx3 !== path) return tx3;
                const findIn = (arr: any[]) => arr && arr.find((c: any) => c && (c.dataField === path || (typeof c.dataField === 'string' && c.dataField.endsWith('.' + path))));
                const col = findIn(this.column) || findIn(this.detailColumn);
                if (col) {
                    const cap = col.caption || col.name || col.header || path;
                    const tc = this.translateService.instant(cap);
                    if (tc && tc !== cap) return tc;
                    return cap;
                }
                return humanize(path);
            };
            if (Array.isArray(this.column) && this.column.length > 0) {
                this.column.forEach((c: any) => configuredFields.push({ path: c.dataField, caption: getCaptionForPath(c.dataField) }));
            }
            if (Array.isArray(this.detailColumn) && this.detailColumn.length > 0) {
                this.detailColumn.forEach((c: any) => configuredFields.push({ path: c.dataField, caption: getCaptionForPath(c.dataField) }));
            }

            let fields = configuredFields;
            if (fields.length === 0) {
                const headerSet = new Set<string>();
                rows.forEach(r => Object.keys(r || {}).forEach(k => headerSet.add(k)));
                fields = Array.from(headerSet).map(k => ({ path: k, caption: k }));
            }

            let table = '<table style="width:100%;border-collapse:collapse;table-layout:fixed;">';
            table += '<thead><tr>' + fields.map(f => `<th style="border:1px solid #ccc;
        padding:4px;
        text-align:left;
        font-size:8px;
        white-space:nowrap;
        word-break:normal;
        overflow:hidden;
        text-overflow:ellipsis;">${escapeHtml(f.caption)}</th>`).join('') + '</tr></thead>';
            table += '<tbody>';
            rows.forEach(r => {
                table += '<tr>' + fields.map(f => `<td style="border:1px solid #ccc;padding:6px;vertical-align:top;word-break:break-word;white-space:normal;font-size:8px;overflow-wrap:break-word">${renderValue((getByPath(r, f.path) as any))}</td>`).join('') + '</tr>';
            });
            table += '</tbody></table>';

            const title = this.translateService.instant('button.pdf') || 'PDF';

            try {
                // @ts-ignore
                const html2canvasModule = await import('html2canvas');
                const html2canvas = ((html2canvasModule && (html2canvasModule as any).default)
                    ? (html2canvasModule as any).default
                    : html2canvasModule) as (el: HTMLElement, opts?: any) => Promise<HTMLCanvasElement>;
                // @ts-ignore
                const jspdfModule = await import('jspdf');
                const { jsPDF } = jspdfModule as any;

                const container = document.createElement('div');
                container.style.position = 'absolute';
                container.style.left = '0';
                container.style.top = '0';
                container.style.width = '1122px';
                container.style.height = '793px';
                container.style.padding = '12px';
                container.style.transform = 'translateX(-2000px)';
                container.style.pointerEvents = 'none';
                container.style.zIndex = '9999';
                container.style.background = '#ffffff';
                container.style.color = '#000000';
                container.innerHTML = `<div style="font-family: Arial, Helvetica, sans-serif;"><h2 style="text-align:center;margin:0 0 18px 0">Masraf Raporu</h2>${table}</div>`;
                document.body.appendChild(container);

                await new Promise<void>(resolve => requestAnimationFrame(() => setTimeout(() => resolve(), 60)));

                console.debug('PDF container HTML length:', (container.innerHTML || '').length);
                const canvas = await html2canvas(container as HTMLElement, { scale: 2, useCORS: true, allowTaint: true, logging: false, scrollY: -window.scrollY });
                const imgData = canvas.toDataURL('image/png');

                const pdf = new jsPDF('l', 'mm', 'a4');
                const imgProps: any = (pdf as any).getImageProperties(imgData);
                // const pdfWidth = pdf.internal.pageSize.getWidth();
                // const pdfHeight = pdf.internal.pageSize.getHeight();
                // pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                const pageWidth = pdf.internal.pageSize.getWidth();
                const pageHeight = pdf.internal.pageSize.getHeight();

                let imgWidth = pageWidth;
                let imgHeight = (imgProps.height * imgWidth) / imgProps.width;

                if (imgHeight > pageHeight) {
                    imgHeight = pageHeight;
                    imgWidth = (imgProps.width * imgHeight) / imgProps.height;
                }

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

                pdf.save('Masraf_Raporu.pdf');
                document.body.removeChild(container);
                return;

            } catch (e) {
                const win = window.open('', '_blank');
                if (!win) {
                    return this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('error'),
                        detail: this.translateService.instant('popupBlocked') || 'Popup blocked. Allow popups for this site.'
                    });
                }

                win.document.write(`\n                <html>\n                    <head>\n                        <title>Masraf Rapor</title>\n                        <style>\n                            body { font-family: Arial, Helvetica, sans-serif; padding: 12px; }\n                            table { font-size: 12px; border-collapse:collapse }\n                            th { background: #f5f5f5; }\n                            ul { margin:0; padding-left:16px }\n+                        </style>\n                    </head>\n                    <body>\n                        <h2 style="text-align:center;margin:0 0 18px 0">Masraf Rapor</h2>\n                        ${table}\n                    </body>\n                </html>\n            `);
                win.document.close();

                setTimeout(() => {
                    try { win.focus(); win.print(); } catch (err) { }
                }, 500);
                return;
            }

        } catch (err) {
            console.error(err);
            this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('error'),
                detail: this.translateService.instant('messageServiceMessages.unexpectedError') || 'Unexpected error while preparing PDF.'
            });
        }
    }
}
