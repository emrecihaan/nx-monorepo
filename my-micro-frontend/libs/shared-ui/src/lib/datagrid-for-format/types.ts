export interface DataGridColumn {
    dataField: string;
    caption: string;
    width?: number | string;
    format?: string;
    dataType?: 'string' | 'number' | 'date' | 'boolean' | 'datetime';
    lookup?: {
        dataSource: any;
        valueExpr: string;
        displayExpr: string;
    };
}
