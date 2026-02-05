import { NgModule } from '@angular/core';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';

const PRIMENG_MODULES = [
    ButtonModule,
    CardModule,
    MenuModule,
    PanelMenuModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    TableModule,
    ChartModule,
    AvatarModule,
    BadgeModule,
    RippleModule,
    TooltipModule,
    SidebarModule,
    ToolbarModule
];

@NgModule({
    imports: PRIMENG_MODULES,
    exports: PRIMENG_MODULES
})
export class PrimeNGModule { }
